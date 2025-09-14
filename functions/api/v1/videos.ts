/// <reference types="@cloudflare/workers-types" />

// --- Environment bindings available to this Worker ---
interface EnvWithVars {
  DB: D1Database;
  MEDIA: R2Bucket;
  R2_PUBLIC_BASE?: string;
  ADMIN_SECRET?: string;
}

//
// GET /api/v1/videos
// - List mode: /api/v1/videos?limit=12&section=news
// - Single mode: /api/v1/videos?id=123
//
export async function onRequestGet(
  { request, env }: { request: Request; env: EnvWithVars }
): Promise<Response> {
  const url = new URL(request.url);

  // --- Single-video mode ---
  const id = url.searchParams.get("id");
  if (id) {
    const row = await env.DB.prepare(
      `SELECT id, slug, title, caption, section, description,
              r2_key, mime, poster_key, captions_key, status, created_at, is_published
       FROM videos
       WHERE id = ?`
    ).bind(id).first();

    if (!row) {
      return Response.json({ ok: false, error: "Video not found" }, { status: 404 });
    }

    const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");
    const item = {
      ...row,
      public_url: row.r2_key ? `${base}/${row.r2_key}` : null,
      poster_url: row.poster_key ? `${base}/${row.poster_key}` : null,
    };

    return Response.json({ ok: true, item });
  }

  // --- List mode ---
  const section = url.searchParams.get("section");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "24", 10), 50);
  const includeUnpublished = url.searchParams.get("all") === "true"; // admin override

  let query = `SELECT id, slug, title, caption, section, description,
                      r2_key, mime, poster_key, captions_key, status, created_at, is_published
               FROM videos
               WHERE is_seed = 0`;

  if (includeUnpublished) {
    // Admin: see everything
  } else {
    // Public: only approved + ready
    query += ` AND is_published = 1 AND status = 'ready'`;
  }

  if (section) query += ` AND section = ?`;
  query += ` ORDER BY datetime(created_at) DESC LIMIT ?`;

  const bindings: any[] = [];
  if (section) bindings.push(section);
  bindings.push(limit);

  const stmt = await env.DB.prepare(query).bind(...bindings).all();

  const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");
  const items = (stmt.results || []).map((row: any) => ({
    ...row,
    public_url: row.r2_key ? `${base}/${row.r2_key}` : null,
    poster_url: row.poster_key ? `${base}/${row.poster_key}` : null,
  }));

  return Response.json({ ok: true, items });
}

//
// POST /api/v1/videos
// - Handles direct multipart/form-data upload.
// - Always creates video as pending approval.
//
export async function onRequestPost(
  { request, env }: { request: Request; env: EnvWithVars }
): Promise<Response> {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const title = (formData.get("title") as string) || "Untitled";
  const caption = (formData.get("caption") as string) || "";
  const section = (formData.get("section") as string) || "news";
  const slug = (formData.get("slug") as string) || crypto.randomUUID();
  const mime = file.type || "video/mp4";

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const key = `media/videos/${year}-${month}/${crypto.randomUUID()}.${ext}`;

  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  await env.DB.prepare(
    `INSERT INTO videos (slug, title, caption, section, r2_key, mime, status, is_published, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'uploaded', 0, datetime('now'))`
  ).bind(slug, title, caption, section, key, mime).run();

  const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");
  return Response.json({
    ok: true,
    slug,
    key,
    public_url: `${base}/${key}`,
    mime,
    title,
    caption,
    section,
  });
}

//
// DELETE /api/v1/videos
// - Deletes both R2 object and DB row.
// - Requires admin token.
//
export async function onRequestDelete(
  { request, env }: { request: Request; env: EnvWithVars }
): Promise<Response> {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body: any = await request.json().catch(() => ({}));
  const { id, slug } = body;
  if (!id && !slug) {
    return Response.json({ ok: false, error: "Missing id or slug" }, { status: 400 });
  }

  const lookup = id
    ? await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE id = ?").bind(id).first()
    : await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE slug = ?").bind(slug).first();

  if (!lookup) {
    return Response.json({ ok: false, error: "Video not found" }, { status: 404 });
  }

  if (lookup.r2_key) {
    await env.MEDIA.delete(String(lookup.r2_key));
  }

  await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(lookup.id).run();

  return Response.json({ ok: true, deleted: lookup });
}
