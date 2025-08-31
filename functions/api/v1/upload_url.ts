export async function onRequestPost({ request, env }) {
  const { filename } = await request.json();
  if (!filename) return new Response("Missing filename", { status: 400 });

  const key = `media/videos/${new Date().toISOString().slice(0,7)}/${crypto.randomUUID()}-${filename}`;
  const uploadUrl = await env.MEDIA.createPresignedUrl({
    method: "PUT",
    key,
    expiresIn: 3600, // 1h
  });

  return Response.json({ uploadUrl, key });
}
