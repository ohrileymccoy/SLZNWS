/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  ADMIN_SECRET: string;
}

export async function onRequestGet({ env }: { env: Env }): Promise<Response> {
  try {
    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"

    // Query DB for stats
    const totalRow = await env.DB.prepare("SELECT COUNT(*) as count FROM videos").first<{ count: number }>();
    const todayRow = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM videos WHERE DATE(created_at) = ?"
    ).bind(today).first<{ count: number }>();
    const lastRow = await env.DB.prepare(
      "SELECT MAX(created_at) as last FROM videos"
    ).first<{ last: string }>();

    return new Response(
      JSON.stringify({
        ok: true,
        stats: {
          newToday: todayRow?.count ?? 0,
          total: totalRow?.count ?? 0,
          lastUpdated: lastRow?.last ?? null,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Stats query failed:", err);
    return new Response(JSON.stringify({ ok: false, error: "DB error" }), { status: 500 });
  }
}
