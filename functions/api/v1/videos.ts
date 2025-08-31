export async function onRequestGet({ request, env }) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get("status");
    const section = url.searchParams.get("section");
    const limit = parseInt(url.searchParams.get("limit") || "12", 10);

    let query = "SELECT id, slug, title, caption, section, r2_key, mime, status, created_at FROM videos WHERE 1=1";
    const binds: any[] = [];

    if (status) {
      query += " AND status = ?";
      binds.push(status);
    }
    if (section) {
      query += " AND section = ?";
      binds.push(section);
    }

    query += " ORDER BY created_at DESC LIMIT ?";
    binds.push(limit);

    const { results } = await env.DB.prepare(query).bind(...binds).all();

    // Attach public URLs
    const items = results.map((row: any) => ({
      ...row,
      public_url: `${env.R2_PUBLIC_BASE}/${row.r2_key}`,
    }));

    return Response.json({ items });
  } catch (err: any) {
    return new Response("Server error: " + err.message, { status: 500 });
  }
}

export async function onRequestPost({ request, env }) {
  try {
    const data = await request.json();
    const { slug, title, caption, section, r2_key, mime, status } = data;

    if (!slug || !r2_key) {
      return new Response("Missing slug or r2_key", { status: 400 });
    }

    await env.DB.prepare(
      "INSERT INTO videos (slug, title, caption, section, r2_key, mime, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(slug, title, caption, section, r2_key, mime, status || "uploaded")
      .run();

    return Response.json({
      ok: true,
      public_url: `${env.R2_PUBLIC_BASE}/${r2_key}`,
    });
  } catch (err: any) {
    return new Response("Server error: " + err.message, { status: 500 });
  }
}

export async function onRequestDelete({ request, env }) {
  try {
    const data = await request.json();
    const { id } = data;
    if (!id) return new Response("Missing video ID", { status: 400 });

    // Look up row
    const { results } = await env.DB.prepare(
      "SELECT r2_key FROM videos WHERE id = ?"
    )
      .bind(id)
      .all();

    if (!results.length) {
      return new Response("Video not found", { status: 404 });
    }

    const r2Key = results[0].r2_key;

    // Delete from R2
    await env.VIDEOS_BUCKET.delete(r2Key);

    // Delete from DB
    await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(id).run();

    return Response.json({ ok: true });
  } catch (err: any) {
    return new Response("Server error: " + err.message, { status: 500 });
  }
}
