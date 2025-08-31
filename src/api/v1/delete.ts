/// <reference types="@cloudflare/workers-types" />

export async function handleDelete(
  request: Request,
  env: { DB: D1Database; MEDIA: R2Bucket }
): Promise<Response> {
  try {
    const body: any = await request.json().catch(() => ({}));
    const { id, slug } = body;

    if (!id && !slug) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing id or slug" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Look up the row to get the R2 key
    const lookup = id
      ? await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE id = ?")
          .bind(id).first()
      : await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE slug = ?")
          .bind(slug).first();

    if (!lookup) {
      return new Response(
        JSON.stringify({ ok: false, error: "Video not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete from R2
   // Delete from R2
if (lookup.r2_key) {
  await env.MEDIA.delete(String(lookup.r2_key));
}

    // Delete from DB
    await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(lookup.id).run();

    return new Response(
      JSON.stringify({ ok: true, deleted: lookup }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err.message || String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
