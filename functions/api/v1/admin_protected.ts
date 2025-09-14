interface Env {
  ADMIN_SECRET: string;
}

export async function onRequest(
  { request, env }: { request: Request; env: Env }
) {
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true, message: "Welcome admin" }), {
    headers: { "Content-Type": "application/json" },
  });
}
