export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT id, slug, title, dek, hero_image, section, created_at FROM articles WHERE is_featured = 1 AND is_published = 1 ORDER BY created_at DESC LIMIT 5"
  ).all();

  return Response.json({ items: results });
}
