export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const title = form.get("title");
    const slug = form.get("slug");
    const caption = form.get("caption");
    const section = form.get("section") || "news";

    if (!(file instanceof File)) {
      return new Response("Missing file", { status: 400 });
    }

    const key = `media/videos/${new Date().toISOString().slice(0,7)}/${crypto.randomUUID()}-${file.name}`;

    // Store file in R2
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    // Save DB row
    await env.DB.prepare(
      "INSERT INTO videos (slug, title, caption, section, r2_key, mime, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
      .bind(slug, title, caption, section, key, file.type, "uploaded")
      .run();

    return Response.json({
      ok: true,
      key,
      public_url: `${env.R2_PUBLIC_BASE}/${key}`,
    });
  } catch (err: any) {
    return new Response("Server error: " + err.message, { status: 500 });
  }
}
