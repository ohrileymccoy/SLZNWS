export async function onRequestGet({ params, env }) {
  const slug = params.slug;
  const { results } = await env.DB.prepare(
    "SELECT * FROM articles WHERE slug = ? AND is_published = 1 LIMIT 1"
  ).bind(slug).all();

  if (!results.length) {
    return new Response("Not Found", { status: 404 });
  }
  return Response.json(results[0]);
}
