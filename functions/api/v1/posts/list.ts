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
  const section = url.searchParams.get("section");

  // Only show approved/published unless admin
  const whereVideos = all ? "1=1" : "status='ready'";
  const wherePhotos = all ? "1=1" : "status='approved'";

  // --- build SQL ---
  let query = `
    SELECT id, slug, title, caption, section, created_at,
           r2_key as media_key, poster_key, 'video' as type,
           status,
           CASE WHEN EXISTS(SELECT 1 FROM pragma_table_info('videos') WHERE name='is_published')
                THEN is_published ELSE 1 END as is_published
    FROM videos
    WHERE ${whereVideos}
  `;
  if (section) query += ` AND section = ?`;

  query += `
    UNION ALL
    SELECT id, slug, title, caption, section, created_at,
           r2_keys as media_key, NULL as poster_key, 'photo' as type,
           status,
           1 as is_published
    FROM photos
    WHERE ${wherePhotos}
  `;
  if (section) query += ` AND section = ?`;

  query += `
    ORDER BY created_at DESC
    LIMIT ?
  `;

  // --- build params ---
  const params: any[] = [];
  if (section) params.push(section); // for videos
  if (section) params.push(section); // for photos
  params.push(limit);

  // --- run query ---
  let results: any[] = [];
  try {
    const { results: rows } = await env.DB.prepare(query).bind(...params).all();
    results = rows;
  } catch (err) {
    console.error("Feed query failed:", err);
    return new Response("Database query failed", { status: 500 });
  }

  // --- map results ---
  const base = env.R2_PUBLIC_BASE || "";
  const items = results.map((row: any) => {
    if (row.type === "photo") {
      let photoUrls: string[] = [];
      try {
        const keys: string[] = JSON.parse(row.media_key);
        photoUrls = keys.map((k) => `${base}/${k}`);
      } catch {
        photoUrls = [];
      }
      return {
        ...row,
        public_url: null,
        photoUrls,
      };
    }

    // video
    return {
      ...row,
      public_url: `${base}/${row.media_key}`,
      photoUrls: [],
    };
  });

  return Response.json({ items });
};
