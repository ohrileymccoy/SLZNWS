export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const title = form.get("title") as string;
    const slug = form.get("slug") as string;
    const caption = form.get("caption") as string;
    const section = (form.get("section") as string) || "news";

    if (!(file instanceof File)) {
      return new Response("Missing file", { status: 400 });
    }

    // --- Build clean key: media/videos/YYYY-MM/uuid.ext ---
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
    const key = `media/videos/${year}-${month}/${crypto.randomUUID()}.${ext}`;

    // Store file in R2
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: {
        contentType: file.type,
        cacheControl: "public, max-age=31536000, immutable",
      },
    });

    // Save DB row (note: only r2_key, not broken public_url)
    await env.DB.prepare(
      "INSERT INTO videos (slug, title, caption, section, r2_key, mime, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'uploaded', datetime('now'))"
    )
      .bind(slug, title, caption, section, key, file.type)
      .run();

    // Build public URL from env var + key
    const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");
    const public_url = `${base}/${key}`;

    return Response.json({
      ok: true,
      key,
      public_url,
    });
  } catch (err: any) {
    return new Response("Server error: " + (err.message || String(err)), {
      status: 500,
    });
  }
}
