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
  const limit = Math.min(
    parseInt(url.searchParams.get("limit") || "24", 10),
    50
  );
  const section = url.searchParams.get("section");

  // Build query dynamically (exclude seed rows)
  let query = `SELECT id, slug, title, caption, section, description,
                      r2_key, mime, poster_key, captions_key, status, created_at
               FROM videos
               WHERE status = ? AND is_seed = 0`;
  if (section) query += ` AND section = ?`;
  query += ` ORDER BY datetime(created_at) DESC LIMIT ?`;

  // Prepare + bind params
  const stmt = section
    ? await env.DB.prepare(query).bind(status, section, limit).all()
    : await env.DB.prepare(query).bind(status, limit).all();

  // Decide local vs prod
  const isLocal =
    url.hostname === "127.0.0.1" || url.hostname === "localhost";

  const base = isLocal
    ? "http://127.0.0.1:8787/r2" // absolute path for local
    : (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, ""); // <-- trim added

  const items = (stmt.results || []).map((row: any) => ({
    ...row,
    // Always rebuild URLs fresh to avoid broken DB values
    public_url: row.r2_key ? `${base}/${row.r2_key}` : null,
    poster_url: row.poster_key ? `${base}/${row.poster_key}` : null,
    eyebrow: row.section || "Video",
    href: null,
  }));

  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" },
  });
}
