// functions/api/v1/mugshots/delete.ts
export async function onRequestPost({ request, env }) {
  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing id" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Look up R2 key
    const lookup = await env.DB.prepare(
      "SELECT r2_key FROM mugshots WHERE id = ?"
    ).bind(id).first();

    if (!lookup) {
      return new Response(
        JSON.stringify({ ok: false, error: "Not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete from R2
    await env.MEDIA.delete(lookup.r2_key);

    // Delete from DB
    await env.DB.prepare("DELETE FROM mugshots WHERE id = ?")
      .bind(id)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
