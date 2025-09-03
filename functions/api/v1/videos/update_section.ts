/// <reference types="@cloudflare/workers-types" />

export async function onRequestPost({ request, env }) {
  // --- Auth check ---
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Parse body safely ---
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { slug, section } = body || {};
  console.log("Update request:", { slug, section });

  // --- Validate inputs ---
  const allowed = ["news", "culture", "sports"];
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!allowed.includes(section)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid section" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Update row (safe: no updated_at) ---
  let result;
  try {
    result = await env.DB.prepare(
      "UPDATE videos SET section = ? WHERE slug = ?"
    )
      .bind(section, slug)
      .run();
  } catch (err) {
    console.error("DB error in update_section:", err);
    return new Response(JSON.stringify({ ok: false, error: "DB error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (result.meta.changes === 0) {
    return new Response(JSON.stringify({ ok: false, error: "Video not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, slug, section }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
