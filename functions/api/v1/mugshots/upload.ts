// functions/api/v1/mugshots/upload.ts
export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const file = form.get("file"); // <input type="file" name="file">
    const name = form.get("name") || "Unknown";
    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    if (!(file instanceof File)) {
      return new Response("No file uploaded", { status: 400 });
    }

    // Save file to R2
    const r2Key = `media/mugshots/${slug}.jpg`;
    await env.MEDIA.put(r2Key, file.stream());

    // Insert into DB
    await env.DB.prepare(
      "INSERT INTO mugshots (slug, name, r2_key) VALUES (?, ?, ?)"
    ).bind(slug, name, r2Key).run();

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
