/// <reference types="@cloudflare/workers-types" />
import type { D1Database } from "@cloudflare/workers-types";

interface Env { 
  DB: D1Database; 
  R2_PUBLIC_BASE: string; 
}

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
    const base = env.R2_PUBLIC_BASE || "";

    // 🔎 Videos
    const videosRes = await env.DB.prepare(
      `SELECT id, slug, title, caption, section, r2_key, poster_key, created_at, 'video' as type
       FROM videos
       WHERE title LIKE ? OR description LIKE ? OR caption LIKE ?
       LIMIT 20`
    ).bind(like, like, like).all();

    const videos = (videosRes.results || []).map((v: any) => ({
      ...v,
      public_url: v.r2_key ? `${base}/${v.r2_key}` : null,
      poster_url: v.poster_key ? `${base}/${v.poster_key}` : null,
    }));

    // 🖼 Photos
    const photosRes = await env.DB.prepare(
      `SELECT id, slug, title, caption, section, r2_keys, created_at, 'photo' as type
       FROM photos
       WHERE title LIKE ? OR caption LIKE ?
       LIMIT 20`
    ).bind(like, like).all();

    const photos = (photosRes.results || []).map((p: any) => ({
      ...p,
      photoUrls: p.r2_keys ? JSON.parse(p.r2_keys).map((k: string) => `${base}/${k}`) : [],
    }));

    return new Response(
      JSON.stringify({ ok: true, items: [...videos, ...photos] }),
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
