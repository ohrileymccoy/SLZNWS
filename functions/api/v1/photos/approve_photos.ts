// functions/api/v1/photos/approve_photos.ts
/// <reference types="@cloudflare/workers-types" />

export interface Env {
  DB: D1Database;
  ADMIN_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const auth = request.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "").trim();

    if (token !== env.ADMIN_SECRET) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json<{ id: number }>();
    if (!body?.id) {
      return Response.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    // ✅ Mark photo as approved for publishing
    await env.DB.prepare(
      `UPDATE photos
         SET status = 'approved'
       WHERE id = ?`
    ).bind(body.id).run();

    // Optionally return the updated row (consistency with videos/approve)
    const updated = await env.DB.prepare(
      `SELECT id, slug, title, caption, section, created_at, status
         FROM photos WHERE id = ?`
    ).bind(body.id).first();

    return Response.json({ ok: true, item: updated });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
};
