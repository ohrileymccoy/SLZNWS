export async function onRequestPost({ request, env }) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return Response.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE videos SET is_published = 1, status = 'ready', updated_at = datetime('now') WHERE slug = ?"
    ).bind(slug).run();

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false, error: err.message || "Server error" }, { status: 500 });
  }
}
