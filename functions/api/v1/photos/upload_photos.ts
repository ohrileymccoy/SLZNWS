// functions/api/v1/photos/upload.ts
export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  R2_PUBLIC_BASE: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const form = await request.formData();
  const files = form.getAll("files");
  const title = form.get("title")?.toString() || "Untitled";
  const caption = form.get("caption")?.toString() || "";
  const section = form.get("section")?.toString() || "news";

  const keys: string[] = [];

  for (const f of files) {
    if (!(f instanceof File)) continue;
    const key = `media/photos/${Date.now()}-${crypto.randomUUID()}-${f.name}`;
    await env.MEDIA.put(key, f.stream(), {
      httpMetadata: { contentType: f.type },
    });
    keys.push(key);
  }

  // Make a slug from title
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  await env.DB.prepare(
    `INSERT INTO photos (slug, title, caption, section, r2_keys, mime)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6)`
  )
    .bind(slug, title, caption, section, JSON.stringify(keys), "image/*")
    .run();

  return Response.json({
    ok: true,
    keys: keys.map((k) => `${env.R2_PUBLIC_BASE}/${k}`),
  });
};
