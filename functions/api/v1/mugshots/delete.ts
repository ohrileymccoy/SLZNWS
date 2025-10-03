/// <reference types="@cloudflare/workers-types" />

import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

export async function onRequestPost({ request, env }: { request: Request; env: Env }): Promise<Response> {
  try {
    const { id } = await request.json<{ id: number }>();

    if (!id) {
      return new Response(JSON.stringify({ ok: false, error: "Missing id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Look up R2 key for this mugshot
    const lookup = await env.DB.prepare(
      "SELECT r2_key FROM mugshots WHERE id = ?"
    ).bind(id).first<{ r2_key: string }>();

    if (!lookup) {
      return new Response(JSON.stringify({ ok: false, error: "Not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Delete from R2 (ignore if already gone)
    try {
      await env.MEDIA.delete(lookup.r2_key);
    } catch {
      console.warn("R2 delete skipped (file not found):", lookup.r2_key);
    }

    // Delete from DB
    await env.DB.prepare("DELETE FROM mugshots WHERE id = ?")
      .bind(id)
      .run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
