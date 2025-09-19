// functions/api/v1/photos/update_section.ts
/// <reference types="@cloudflare/workers-types" />
export interface Env {
  DB: D1Database;
  ADMIN_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "");

    if (token !== env.ADMIN_SECRET) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, section } = await request.json<any>();

    if (!id || !section) {
      return Response.json({ ok: false, error: "Missing id or section" }, { status: 400 });
    }

    await env.DB.prepare(
      "UPDATE photos SET section = ? WHERE id = ?"
    )
      .bind(section, id)
      .run();

    return Response.json({ ok: true });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err.message || "Failed to update section" },
      { status: 500 }
    );
  }
};
