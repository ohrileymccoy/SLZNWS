export async function onRequestGet({ env }) {
  const { results } = await env.DB.prepare(
    "SELECT id, r2_key, title, created_at FROM videos WHERE status = ? ORDER BY created_at DESC LIMIT ?"
  ).bind("uploaded", 12).all();

  return Response.json({ items: results });
}
