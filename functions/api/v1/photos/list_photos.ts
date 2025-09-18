// functions/api/v1/photos/list.ts
export interface Env {
  DB: D1Database;
  R2_PUBLIC_BASE: string;
}

type PhotoRow = {
  id: number;
  slug: string;
  title: string;
  caption: string;
  section: string;
  r2_keys: string;  // stored as JSON array of keys
  created_at: string;
};

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const { results } = await env.DB.prepare(
    "SELECT * FROM photos WHERE status='uploaded' ORDER BY created_at DESC LIMIT 50"
  ).all<PhotoRow>();

  const base = env.R2_PUBLIC_BASE || "";

  const items = results.map((row) => {
    let keys: string[] = [];
    try {
      keys = JSON.parse(row.r2_keys);
    } catch {
      keys = [];
    }

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      caption: row.caption,
      section: row.section,
      created_at: row.created_at,
      photoUrls: keys.map((k) => `${base}/${k}`),
    };
  });

  return Response.json({ items });
};
