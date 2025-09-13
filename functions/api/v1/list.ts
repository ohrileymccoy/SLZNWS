/// <reference types="@cloudflare/workers-types" />

// Build-time/env var comes from wrangler.toml [vars]
type EnvWithVars = {
  DB: D1Database;
  R2_PUBLIC_BASE?: string;
};

export async function handleList(
  request: Request,
  env: EnvWithVars
): Promise<Response> {
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "uploaded";
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "24", 10), 50);
  const section = url.searchParams.get("section");
  const includeUnpublished = url.searchParams.get("all") === "true"; // admin override

  let query = `SELECT id, slug, title, caption, section, description,
                      r2_key, mime, poster_key, captions_key, status,
                      created_at, is_published
               FROM videos
               WHERE is_seed = 0`;

  // Public: only published + matching status
  if (!includeUnpublished) {
    query += ` AND is_published = 1 AND status = ?`;
  } else {
    // Admin: see all, regardless of is_published
    query += status ? ` AND status = ?` : ``;
  }

  if (section) query += ` AND section = ?`;
  query += ` ORDER BY datetime(created_at) DESC LIMIT ?`;

  const stmt = section
    ? await env.DB.prepare(query).bind(
        includeUnpublished ? status : status, // keep status param consistent
        section,
        limit
      ).all()
    : await env.DB.prepare(query).bind(
        includeUnpublished ? status : status,
        limit
      ).all();

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

