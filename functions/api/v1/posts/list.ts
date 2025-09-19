// functions/api/v1/posts/list.ts
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
    SELECT * FROM (
      SELECT 
        id,
        slug,
        title,
        caption,
        section,
        created_at,
        r2_key AS media_url,     -- unified column
        poster_key,
        'video' AS type,
        status,
        is_published
      FROM videos
      WHERE ${whereVideos}

      UNION ALL

      SELECT 
        id,
        slug,
        title,
        caption,
        section,
        created_at,
        r2_keys AS media_url,    -- JSON array of photo keys
        NULL AS poster_key,
        'photo' AS type,
        status,
        0 AS is_published
      FROM photos
      WHERE ${wherePhotos}
    )
    ORDER BY datetime(created_at) DESC
    LIMIT ?
  `;

  const { results } = await env.DB.prepare(query).bind(limit).all();

  const base = env.R2_PUBLIC_BASE || "";
  const items = results.map((row: any) => {
    if (row.type === "photo") {
      let photoUrls: string[] = [];
      try {
        const keys: string[] = JSON.parse(row.media_url);
        photoUrls = keys.map((k) => `${base}/${k}`);
      } catch {
        photoUrls = [];
      }
      return { ...row, photoUrls };
    } else {
      // normalize to what frontend already expects
      return { ...row, public_url: `${base}/${row.media_url}` };
    }
  });

  return Response.json({ items });
};
