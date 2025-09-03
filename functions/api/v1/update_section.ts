export async function onRequestPost({ request, env }) {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body: any = await request.json().catch(() => ({}));
  const { slug, section } = body;
  if (!slug || !section) {
    return Response.json({ ok: false, error: "Missing slug or section" }, { status: 400 });
  }

  await env.DB.prepare("UPDATE videos SET section = ? WHERE slug = ?").bind(section, slug).run();

  return Response.json({ ok: true, slug, section });
}
