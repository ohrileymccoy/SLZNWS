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
  r2_keys: string;
  created_at: string;
  status: string;
};

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const rawId = url.searchParams.get("id");

  // Sanitize id → keep only numbers
  const id = parseInt((rawId || "").replace(/\D/g, ""), 10);
  if (!id || isNaN(id)) {
    return Response.json({ error: "Invalid id" }, { status: 400 });
  }

  const row = (await env.DB.prepare(
    "SELECT * FROM photos WHERE id = ? AND status = 'uploaded'"
  ).bind(id).first()) as PhotoRow | null;

  if (!row) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let photoUrls: string[] = [];
  try {
    const keys: string[] = JSON.parse(row.r2_keys);
    photoUrls = keys.map((k) => `${env.R2_PUBLIC_BASE}/${k}`);
  } catch {
    photoUrls = [];
  }

  return Response.json({
    item: {
      id: row.id,
      slug: row.slug,
      title: row.title,
      caption: row.caption,
      section: row.section,
      created_at: row.created_at,
      photoUrls,
    },
  });
};
