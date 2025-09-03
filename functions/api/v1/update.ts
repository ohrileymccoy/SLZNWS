/// <reference types="@cloudflare/workers-types" />

type EnvWithVars = {
  DB: D1Database;
  ADMIN_SECRET?: string;
};

export async function onRequestPost({ request, env }: { request: Request; env: EnvWithVars }) {
  try {
    // Optional admin secret check (recommended)
    const auth = request.headers.get("x-admin-secret");
    if (env.ADMIN_SECRET && auth !== env.ADMIN_SECRET) {
      return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { id, section } = await request.json<any>();
    if (!id || !section) {
      return new Response(JSON.stringify({ ok: false, error: "Missing id or section" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Valid sections
    const allowed = ["news", "culture", "sports", "featured"];
    if (!allowed.includes(section)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid section" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB.prepare("UPDATE videos SET section = ? WHERE id = ?")
      .bind(section, id)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
