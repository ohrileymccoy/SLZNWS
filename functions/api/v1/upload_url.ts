/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  R2_PUBLIC_BASE: string;
}

export async function onRequestPost(
  { request, env }: { request: Request; env: Env }
): Promise<Response> {
  try {
    const form = await request.formData();
    const file = form.get("file") as File;
    if (!(file instanceof File)) {
      return new Response("Missing file", { status: 400 });
    }

    // --- Build standardized key: media/videos/YYYY-MM/uuid.ext ---
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
    const key = `media/videos/${year}-${month}/${crypto.randomUUID()}.${ext}`;

    // --- Store file in R2 ---
    await env.MEDIA.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });

    // --- Insert metadata in D1 ---
    await env.DB.prepare(
      `INSERT INTO videos (slug, title, caption, section, r2_key, mime, status, is_published, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'uploaded', 0, datetime('now'))`
    ).bind(
      form.get("slug") || crypto.randomUUID(),
      form.get("title") || "Untitled",
      form.get("caption") || "",
      form.get("section") || "news",
      key,
      file.type || "video/mp4"
    ).run();

    // --- Build public URL safely (strip newline/slash) ---
    const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");
    return Response.json({
      ok: true,
      key,
      public_url: `${base}/${key}`,
    });
  } catch (err: any) {
    return new Response("Server error: " + (err.message || String(err)), {
      status: 500,
    });
  }
}
