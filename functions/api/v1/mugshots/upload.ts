// functions/api/v1/mugshots/upload.ts
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

// Explicit context type so TS knows about env.DB and env.MEDIA
interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  try {
    const form = await request.formData();
    const file = form.get("file");
    const name = (form.get("name") as string) || "Unknown";
    const stats = (form.get("stats") as string) || null;
    const charges = (form.get("charges") as string) || null;

    const slug = name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    // Runtime guard: TS won’t allow instanceof File cleanly, so check stream
    if (!file || typeof (file as any).stream !== "function") {
      return new Response(JSON.stringify({ ok: false, error: "No file uploaded" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const r2Key = `media/mugshots/${slug}.jpg`;

    // Cast stream to any to appease TS; Cloudflare accepts it at runtime
    await env.MEDIA.put(r2Key, (file as any).stream() as any, {
      httpMetadata: { contentType: (file as any).type || "image/jpeg" },
    });

    await env.DB.prepare(
      `INSERT INTO mugshots (slug, name, stats, charges, r2_key, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`
    )
      .bind(slug, name, stats, charges, r2Key)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}