interface Env {
  DB: D1Database;
  R2_PUBLIC_BASE: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT id, slug, name, r2_key, created_at FROM mugshots WHERE status='uploaded' ORDER BY created_at DESC LIMIT 50"
  ).all();

  const base = env.R2_PUBLIC_BASE || "";
  const items = results.map((m: any) => ({
    ...m,
    public_url: `${base}/${m.r2_key}`,
  }));

  return new Response(JSON.stringify({ items }), {
    headers: { "Content-Type": "application/json" },
  });
};
