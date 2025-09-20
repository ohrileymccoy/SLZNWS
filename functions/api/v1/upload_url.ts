/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  R2_PUBLIC_BASE: string;
  ADMIN_SECRET?: string;
}

export async function onRequestPost(
  { request, env }: { request: Request; env: Env }
): Promise<Response> {
  try {
    // --- Auth check ---
    const auth = request.headers.get("Authorization");
    if (!env.ADMIN_SECRET || auth !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const form = await request.formData();
    const file = form.get("file") as File;
    if (!(file instanceof File)) {
      return new Response("Missing file", { status: 400 });
    }

    // --- Safe slug ---
    const rawSlug = (form.get("slug") as string) || crypto.randomUUID();
    const slug = rawSlug
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    // --- Build standardized key: media/videos/YYYY-MM/uuid.ext ---
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
    const key = `media/videos/${year}-${month}/${crypto.randomUUID()}.${ext}`;

    // --- Store file in R2 ---
    try {
      await env.MEDIA.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });
    } catch (r2Err: any) {
      console.error("R2 put failed:", r2Err);
      return new Response("R2 upload failed: " + (r2Err.message || String(r2Err)), { status: 502 });
    }

    // --- Insert metadata in D1 ---
    try {
      await env.DB.prepare(
        `INSERT INTO videos (slug, title, caption, section, r2_key, mime, status, is_published, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'uploaded', 0, datetime('now'))`
      ).bind(
        slug,
        form.get("title") || "Untitled",
        form.get("caption") || "",
        form.get("section") || "news",
        key,
        file.type || "video/mp4"
      ).run();
    } catch (dbErr: any) {
      console.error("DB insert failed:", dbErr);
      return new Response("DB insert failed: " + (dbErr.message || String(dbErr)), { status: 500 });
    }

    // --- Build public URL safely (strip newline/slash) ---
    const base = (env.R2_PUBLIC_BASE || "").trim().replace(/\/$/, "");
    return Response.json({
      ok: true,
      key,
      public_url: `${base}/${key}`,
    });
  } catch (err: any) {
    console.error("Unexpected upload error:", err);
    return new Response("Server error: " + (err.message || String(err)), { status: 500 });
  }
}
