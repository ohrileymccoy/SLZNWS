/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
}

export async function onRequestPost(
  { request, env }: { request: Request; env: Env }
): Promise<Response> {
  try {
    const { slug } = await request.json() as { slug?: string };

    if (!slug) {
      return Response.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE videos SET is_published = 1, status = 'ready', updated_at = datetime('now') WHERE slug = ?"
    ).bind(slug).run();

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
