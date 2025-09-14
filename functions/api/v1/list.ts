/// <reference types="@cloudflare/workers-types" />

interface EnvWithVars {
  DB: D1Database;
  R2_PUBLIC_BASE?: string;
}

export async function handleList(
  request: Request,
  env: EnvWithVars
): Promise<Response> {
  const url = new URL(request.url);

  const limit = Math.min(parseInt(url.searchParams.get("limit") || "24", 10), 50);
  const section = url.searchParams.get("section");
  const includeUnpublished = url.searchParams.get("all") === "true"; // admin override

  let query = `SELECT id, slug, title, caption, section, description,
                      r2_key, mime, poster_key, captions_key, status,
                      created_at, is_published
               FROM videos
               WHERE is_seed = 0`;

  if (includeUnpublished) {
    // Admin view: see everything
    if (url.searchParams.has("status")) {
      query += ` AND status = ?`;
    }
  } else {
    // Public view: only approved videos
    query += ` AND is_published = 1 AND status = 'ready'`;
  }

  if (section) query += ` AND section = ?`;
  query += ` ORDER BY datetime(created_at) DESC LIMIT ?`;

  const bindings: any[] = [];
  if (includeUnpublished && url.searchParams.has("status")) {
    bindings.push(url.searchParams.get("status"));
  }
  if (section) bindings.push(section);
  bindings.push(limit);

  const stmt = await env.DB.prepare(query).bind(...bindings).all();

  const isLocal = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const base = isLocal
    ? "http://127.0.0.1:8787/r2"
    : (env.R2_PUBLIC_BASE || "").replace(/\/$/, "");

  const items = (stmt.results || []).map((row: any) => ({
    ...row,
    public_url: row.r2_key ? `${base}/${row.r2_key}` : null,
    poster_url: row.poster_key ? `${base}/${row.poster_key}` : null,
    eyebrow: row.section || "Video",
    href: null,
  }));

  return new Response(JSON.stringify({ ok: true, items }), {
    headers: { "Content-Type": "application/json" },
  });
}
