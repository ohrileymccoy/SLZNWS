/// <reference types="@cloudflare/workers-types" />
import type { D1Database } from "@cloudflare/workers-types";

interface Env { DB: D1Database }

export async function onRequestGet({ request, env }: { request: Request; env: Env }): Promise<Response> {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.trim();

    if (!q) {
      return new Response(JSON.stringify({ ok: false, error: "Missing query" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const like = `%${q}%`;

    const videos = await env.DB.prepare(
      `SELECT id, slug, title, caption, section, r2_key, poster_key, created_at, 'video' as type
       FROM videos
       WHERE title LIKE ? OR description LIKE ? OR caption LIKE ?
       LIMIT 20`
    ).bind(like, like, like).all();

    const photos = await env.DB.prepare(
      `SELECT id, slug, title, caption, section, r2_keys, created_at, 'photo' as type
       FROM photos
       WHERE title LIKE ? OR caption LIKE ?
       LIMIT 20`
    ).bind(like, like).all();

    return new Response(
      JSON.stringify({ ok: true, items: [...(videos.results || []), ...(photos.results || [])] }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
