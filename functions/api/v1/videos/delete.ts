/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
  ADMIN_SECRET: string;
}

type VideoRow = {
  id: number;
  slug: string;
  r2_key?: string | null;
};

export async function onRequestPost(
  { request, env }: { request: Request; env: Env }
): Promise<Response> {
  // --- Auth check ---
  const auth = request.headers.get("Authorization");
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response(JSON.stringify({ ok: false, error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Parse body safely ---
  let body: { id?: number; slug?: string; purgeR2?: boolean };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = body?.id;
  const slug = body?.slug;
  const purgeR2 = body?.purgeR2 === true;

  if (!id && !slug) {
    return new Response(JSON.stringify({ ok: false, error: "Missing id or slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (slug && !/^[a-z0-9-]+$/.test(slug)) {
    return new Response(JSON.stringify({ ok: false, error: "Invalid slug" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Lookup row to get r2_key ---
  const lookup = id
    ? await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE id = ?")
        .bind(id)
        .first<VideoRow>()
    : await env.DB.prepare("SELECT id, slug, r2_key FROM videos WHERE slug = ?")
        .bind(slug)
        .first<VideoRow>();

  if (!lookup) {
    return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // --- Delete DB row ---
  await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(lookup.id).run();

  // --- Optionally delete from R2 ---
  if (purgeR2 && lookup.r2_key) {
    try {
      await env.MEDIA.delete(lookup.r2_key as string);
    } catch {
      // swallow error; don't break DB deletion
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      id: lookup.id,
      slug: lookup.slug,
      purged: purgeR2,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
