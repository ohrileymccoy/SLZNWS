/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  R2_PUBLIC_BASE: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const { results } = await env.DB.prepare(
      `SELECT id, slug, name, stats, charges, r2_key, created_at
       FROM mugshots
       WHERE status='uploaded'
       ORDER BY datetime(created_at) DESC
       LIMIT 50`
    ).all();

    const base = env.R2_PUBLIC_BASE || "";
    const items = (results || []).map((m: any) => ({
      ...m,
      public_url: `${base}/${m.r2_key}`,
    }));

    return new Response(JSON.stringify({ ok: true, items }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
