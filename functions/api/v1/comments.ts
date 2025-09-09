/// <reference types="@cloudflare/workers-types" />

type Env = { DB: D1Database };

type CommentPayload = {
  video_id: number;
  username: string;
  body: string;
};

function sanitize(input: string) {
  return input.replace(/<[^>]+>/g, "");
}

// --- POST /api/v1/comments ---
// Inserts a new comment, then fetches and returns it
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

    // Insert row
    const result = await env.DB.prepare(
      "INSERT INTO comments (video_id, username, body) VALUES (?, ?, ?)"
    ).bind(Number(video_id), safeUser, safeBody).run();

    // Get the new row back
    const insertedId = (result as any).lastInsertRowId;
    const newComment = await env.DB.prepare(
      "SELECT id, username, body, created_at FROM comments WHERE id = ?"
    ).bind(insertedId).first();

    return new Response(JSON.stringify({ ok: true, comment: newComment }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// --- GET /api/v1/comments?video_id=123&limit=1 ---
// Fetches comments for a video (limit=1 for preview)
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  const url = new URL(request.url);
  const video_id = url.searchParams.get("video_id");
  const limit = Number(url.searchParams.get("limit") || "0");

  if (!video_id) {
    return new Response(JSON.stringify({ ok: false, error: "Missing video_id" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const sql =
    limit === 1
      ? "SELECT id, username, body, created_at FROM comments WHERE video_id = ? ORDER BY created_at DESC LIMIT 1"
      : "SELECT id, username, body, created_at FROM comments WHERE video_id = ? ORDER BY created_at DESC";

  const rows = await env.DB.prepare(sql).bind(Number(video_id)).all();

  return new Response(JSON.stringify({ ok: true, comments: rows.results || [] }), {
    headers: { "Content-Type": "application/json" },
  });
}

// --- DELETE /api/v1/comments ---
// Deletes a comment by id
export async function onRequestDelete({ request, env }: { request: Request; env: Env }) {
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
}
