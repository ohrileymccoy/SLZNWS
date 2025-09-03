/// <reference types="@cloudflare/workers-types" />

// --- Environment bindings available to this Worker ---
type EnvWithVars = {
  DB: D1Database;
  MEDIA: R2Bucket;
  R2_PUBLIC_BASE?: string;
  ADMIN_SECRET?: string;
};


//
// GET /api/v1/videos?status=uploaded&limit=12&section=news
// - Lists videos with optional filters.
// - Always rebuilds `public_url` from r2_key + R2_PUBLIC_BASE to avoid broken DB values.
//
export async function onRequestGet({ request, env }: { request: Request; env: EnvWithVars }) {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "uploaded";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "24", 10), 50);
  const section = url.searchParams.get("section");

  // --- Build query (exclude seeded rows) ---
  let query = `SELECT id, slug, title, caption, section, description,
                      r2_key, mime, poster_key, captions_key, status, created_at
               FROM videos
               WHERE status = ? AND is_seed = 0`;
  if (section) query += ` AND section = ?`;
  query += ` ORDER BY datetime(created_at) DESC LIMIT ?`;

  // --- Execute query ---
  const stmt = section
    ? await env.DB.prepare(query).bind(status, section, limit).all()
    : await env.DB.prepare(query).bind(status, limit).all();

  // --- Base URL for public assets (strip trailing slash, trim newlines) ---
  const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");

  // --- Map results: always rebuild URLs cleanly ---
  const items = (stmt.results || []).map((row: any) => ({
    ...row,
    public_url: row.r2_key ? `${base}/${row.r2_key}` : null,
    poster_url: row.poster_key ? `${base}/${row.poster_key}` : null,
  }));

  return Response.json({ items });
}

//
// POST /api/v1/videos
// - Handles direct multipart/form-data upload.
// - Stores file in R2 and metadata in D1.
// - Returns clean public_url.
//
export async function onRequestPost({ request, env }: { request: Request; env: EnvWithVars }) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  // --- Validation: require a file ---
  if (!(file instanceof File)) {
    return Response.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  // --- Extract metadata from form ---
  const title = (formData.get("title") as string) || "Untitled";
  const caption = (formData.get("caption") as string) || "";
  const section = (formData.get("section") as string) || "news";
  const slug = (formData.get("slug") as string) || crypto.randomUUID();
  const mime = file.type || "video/mp4";

  // --- Build key: media/videos/YYYY-MM/uuid.ext ---
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const key = `media/videos/${year}-${month}/${crypto.randomUUID()}.${ext}`;

  // --- Upload file to R2 ---
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  // --- Insert metadata into D1 ---
  await env.DB.prepare(
    `INSERT INTO videos (slug, title, caption, section, r2_key, mime, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'uploaded', datetime('now'))`
  ).bind(slug, title, caption, section, key, mime).run();

  // --- Build public URL safely ---
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
// - Requires Authorization header: Bearer ADMIN_SECRET
// - Body: { id, slug } (at least one required)
//
export async function onRequestDelete({ request, env }: { request: Request; env: EnvWithVars }) {
console.log("DEBUG R2_PUBLIC_BASE:", env.R2_PUBLIC_BASE);

  // --- Auth check ---
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
    
  }

  // --- Parse body ---
  const body: any = await request.json().catch(() => ({}));
  const { id, slug } = body;
  if (!id && !slug) {
    return Response.json({ ok: false, error: "Missing id or slug" }, { status: 400 });
  }

  // --- Lookup row in DB ---
  const lookup = id
    ? await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE id = ?").bind(id).first()
    : await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE slug = ?").bind(slug).first();

  if (!lookup) {
    return Response.json({ ok: false, error: "Video not found" }, { status: 404 });
  }

  // --- Delete from R2 if exists ---
  if (lookup.r2_key) {
    await env.MEDIA.delete(String(lookup.r2_key));
  }

  // --- Delete from DB ---
  await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(lookup.id).run();

  return Response.json({ ok: true, deleted: lookup });
}
