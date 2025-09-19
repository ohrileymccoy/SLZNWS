/// <reference types="@cloudflare/workers-types" />

type Env = { DB: D1Database; ADMIN_SECRET?: string };

type CommentPayload = {
  video_id?: number;
  photo_id?: number;
  username: string;
  body: string;
};

function sanitize(input: string) {
  return input.replace(/<[^>]+>/g, "");
}

// --- POST /api/v1/comments ---
// Inserts a new comment (public)
export async function onRequestPost({ request, env }: { request: Request; env: Env }) {
  try {
    const data = (await request.json()) as Partial<CommentPayload>;
    const { video_id, photo_id, username, body } = data;

    if ((!video_id && !photo_id) || !username || !body) {
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
      `INSERT INTO comments (video_id, photo_id, username, body)
       VALUES (?, ?, ?, ?)
       RETURNING id, video_id, photo_id, username, body, created_at`
    )
      .bind(video_id || null, photo_id || null, safeUser, safeBody)
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
// Public: requires ?video_id=123 OR ?photo_id=456
// Admin: if neither, requires ADMIN_SECRET and returns all comments
export async function onRequestGet({ request, env }: { request: Request; env: Env }) {
  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get("video_id");
    const photoId = url.searchParams.get("photo_id");
    const limit = Number(url.searchParams.get("limit") || "0");

    if (!videoId && !photoId) {
      // --- Admin mode ---
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
        return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }

      const rows = await env.DB.prepare(
        `SELECT c.id, c.video_id, c.photo_id,
                v.slug as video_slug, v.title as video_title,
                p.slug as photo_slug, p.title as photo_title,
                c.username, c.body, c.created_at
         FROM comments c
         LEFT JOIN videos v ON c.video_id = v.id
         LEFT JOIN photos p ON c.photo_id = p.id
         ORDER BY c.created_at DESC`
      ).all();

      return new Response(JSON.stringify({ ok: true, comments: rows.results || [] }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // --- Public mode ---
    let query = "SELECT id, username, body, created_at FROM comments WHERE 1=1";
    const params: any[] = [];

    if (videoId) {
      query += " AND video_id = ?";
      params.push(Number(videoId));
    }
    if (photoId) {
      query += " AND photo_id = ?";
      params.push(Number(photoId));
    }

    query += " ORDER BY created_at DESC";
    if (limit === 1) query += " LIMIT 1";

    const rows = await env.DB.prepare(query).bind(...params).all();

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
