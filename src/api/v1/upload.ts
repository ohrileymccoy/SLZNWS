export async function handleUpload(
  request: Request,
  env: { DB: D1Database; VIDEOS_BUCKET: R2Bucket; R2_PUBLIC_BASE?: string }
) {
  const url = new URL(request.url);
  const title = url.searchParams.get("title") ?? "Untitled";
  const description = url.searchParams.get("description") ?? "";
  const slug = url.searchParams.get("slug") ?? crypto.randomUUID();
  const ext = (url.searchParams.get("ext") ?? "mp4").replace(/\./g, "").toLowerCase();
  const mime = request.headers.get("content-type") || "video/mp4";

  const now = new Date();
  const key = `media/videos/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${crypto.randomUUID()}.${ext}`;

  // Store in R2 with the right content-type
  await env.VIDEOS_BUCKET.put(key, request.body, {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  // Store only the object key in D1
  await env.DB.prepare(
    `INSERT INTO videos (slug,title,description,r2_key,mime,status)
     VALUES (?,?,?,?,?, 'uploaded')`
  ).bind(slug, title, description, key, mime).run();

  // Build public URL with the same base you use in list.ts
  const base = (env.R2_PUBLIC_BASE || "").replace(/\/$/, "");
  const publicUrl = `${base}/${key}`;

  return Response.json({ ok: true, slug, key, url: publicUrl, mime });
}
