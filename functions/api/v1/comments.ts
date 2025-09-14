/// <reference types="@cloudflare/workers-types" />

type Env = { DB: D1Database; ADMIN_SECRET?: string };

type CommentPayload = {
  video_id: number;
  username: string;
  body: string;
};

function sanitize(input: string) {
  return input.replace(/<[^>]+>/g, "");
}

// --- POST /api/v1/comments ---
// Inserts a new comment and returns it
export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    const data = (await request.json()) as Partial<CommentPayload>;
    const { video_id, username, body } = data;

    if (!video_id || !username || !body) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (username.length > 32 || body.length > 1000) {
      return new Response(JSON.stringify({ ok: false, error: "Too long" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const safeUser = sanitize(username);
    const safeBody = sanitize(body);

    const newComment = await env.DB.prepare(
      "INSERT INTO comments (video_id, username, body) VALUES (?, ?, ?) RETURNING id, video_id, username, body, created_at"
    )
      .bind(Number(video_id), safeUser, safeBody)
      .first();

    return new Response(JSON.stringify({ ok: true, comment: newComment }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// --- GET /api/v1/comments ---
// Public: requires video_id
// Admin: if no video_id, requires ADMIN_SECRET and returns all comments
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get("video_id");
    const limit = Number(url.searchParams.get("limit") || "0");

    // Admin mode: no video_id provided
    if (!videoId) {
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
        return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      const rows = await env.DB.prepare(
        "SELECT id, video_id, username, body, created_at FROM comments ORDER BY created_at DESC"
      ).all();

      return new Response(JSON.stringify({ ok: true, comments: rows.results || [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Public mode: must provide video_id
    const sql =
      limit === 1
        ? "SELECT id, username, body, created_at FROM comments WHERE video_id = ? ORDER BY created_at DESC LIMIT 1"
        : "SELECT id, username, body, created_at FROM comments WHERE video_id = ? ORDER BY created_at DESC";

    const rows = await env.DB.prepare(sql).bind(Number(videoId)).all();

    return new Response(JSON.stringify({ ok: true, comments: rows.results || [] }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// --- DELETE /api/v1/comments ---
// Deletes a comment by id (admin only)
export async function onRequestDelete({ request, env }: { request: Request; env: Env }) {
  try {
    const auth = request.headers.get("Authorization");
    if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
      return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = (await request.json().catch(() => ({}))) as { id?: number };

    if (!body.id) {
      return new Response(JSON.stringify({ ok: false, error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await env.DB.prepare("DELETE FROM comments WHERE id = ?").bind(body.id).run();

    return new Response(JSON.stringify({ ok: true, deleted: body.id }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
