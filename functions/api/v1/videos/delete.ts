export async function onRequestPost({ request, env }) {
  try {
    const { id } = await request.json();
    if (!id) return new Response("Missing video ID", { status: 400 });

    // Look up video to get R2 key
    const { results } = await env.DB.prepare(
      "SELECT r2_key FROM videos WHERE id = ?"
    ).bind(id).all();

    if (!results.length) {
      return new Response("Not found", { status: 404 });
    }

    const r2Key = results[0].r2_key;

    // Delete from R2
    await env.MEDIA.delete(r2Key);

    // Delete from DB
    await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(id).run();

    return Response.json({ success: true });
  } catch (err) {
    return new Response("Server error: " + err.message, { status: 500 });
  }
}
