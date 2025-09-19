// functions/api/v1/posts/list.ts
/// <reference types="@cloudflare/workers-types" />
export interface Env {
  DB: D1Database;
  R2_PUBLIC_BASE: string;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const limit = Number(url.searchParams.get("limit") || 50);
  const all = url.searchParams.get("all") === "true"; // admin sees unpublished

  // Only show approved/published unless admin
  const whereVideos = all ? "1=1" : "status='ready'";
  const wherePhotos = all ? "1=1" : "status='approved'";

  const query = `
    SELECT id, slug, title, caption, section, created_at,
           public_url, poster_key, 'video' as type,
           status, is_published
    FROM videos
    WHERE ${whereVideos}
    UNION ALL
    SELECT id, slug, title, caption, section, created_at,
           r2_keys as public_url, NULL as poster_key, 'photo' as type,
           status, 0 as is_published
    FROM photos
    WHERE ${wherePhotos}
    ORDER BY created_at DESC
    LIMIT ?
  `;

  const { results } = await env.DB.prepare(query).bind(limit).all();

  // Map photos correctly: turn r2_keys JSON into array of URLs
  const base = env.R2_PUBLIC_BASE || "";
  const items = results.map((row: any) => {
    if (row.type === "photo") {
      let photoUrls: string[] = [];
      try {
        const keys: string[] = JSON.parse(row.public_url);
        photoUrls = keys.map((k) => `${base}/${k}`);
      } catch {
        photoUrls = [];
      }
      return { ...row, photoUrls };
    }
    return row;
  });

  return Response.json({ items });
};
