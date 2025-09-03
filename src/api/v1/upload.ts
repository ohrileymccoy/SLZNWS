export async function handleUpload(
  request: Request,
  env: { DB: D1Database; MEDIA: R2Bucket; R2_PUBLIC_BASE?: string }
) {
  // Parse form fields from multipart/form-data
  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return Response.json({ ok: false, error: "Missing file" }, { status: 400 });
  }

  const title = (formData.get("title") as string) || "Untitled";
  const caption = (formData.get("caption") as string) || "";
  const section = (formData.get("section") as string) || "news";
  const slug =
    (formData.get("slug") as string) || crypto.randomUUID();
  const mime = file.type || "video/mp4";
// --- Validation layer ---
const allowedSections = ["news", "culture", "sports"];
const maxTitleLength = 200;
const maxCaptionLength = 1000;

// Slug: only lowercase letters, numbers, hyphens
if (!/^[a-z0-9-]+$/.test(slug)) {
  return Response.json({ ok: false, error: "Invalid slug format" }, { status: 400 });
}

// Section: must be one of allowed
if (!allowedSections.includes(section)) {
  return Response.json({ ok: false, error: "Invalid section" }, { status: 400 });
}

// Title length
if (title.length > maxTitleLength) {
  return Response.json({ ok: false, error: "Title too long" }, { status: 400 });
}

// Caption length
if (caption.length > maxCaptionLength) {
  return Response.json({ ok: false, error: "Caption too long" }, { status: 400 });
}

  // Build R2 key: media/videos/YYYY/MM/uuid.ext
  const now = new Date();
  const ext =
    (file.name.split(".").pop() || "mp4").replace(/\./g, "").toLowerCase();
  const key = `media/videos/${now.getFullYear()}/${String(
    now.getMonth() + 1
  ).padStart(2, "0")}/${crypto.randomUUID()}.${ext}`;

  // Store in R2 with the right content-type
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: {
      contentType: mime,
      cacheControl: "public, max-age=31536000, immutable",
    },
  });

  // Store metadata in D1
  await env.DB.prepare(
    `INSERT INTO videos (slug, title, caption, section, r2_key, mime, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'uploaded', datetime('now'))`
  )
    .bind(slug, title, caption, section, key, mime)
    .run();

  // Build public URL with the same base you use in list.ts
  const base = (env.R2_PUBLIC_BASE || "").replace(/\/$/, "");
  const publicUrl = `${base}/${key}`;

  return Response.json({
    ok: true,
    slug,
    key,
    url: publicUrl,
    mime,
    title,
    caption,
    section,
  });
}
