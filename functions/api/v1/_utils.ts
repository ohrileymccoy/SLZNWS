/// <reference types="@cloudflare/workers-types" />

export type Env = {
  DB: D1Database;
  MEDIA: R2Bucket;
  ADMIN_SECRET: string;
  R2_PUBLIC_BASE?: string; // if you use it elsewhere
};

export function json(data: unknown, init: number | ResponseInit = 200): Response {
  const status = typeof init === "number" ? init : (init as ResponseInit).status ?? 200;
  const headers = new Headers(
    typeof init === "number" ? {} : (init as ResponseInit).headers ?? {}
  );
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(data), { status, headers });
}

export function requireAdmin(request: Request, env: Env): Response | null {
  const auth = request.headers.get("authorization") || request.headers.get("Authorization") || "";
  if (auth !== `Bearer ${env.ADMIN_SECRET}`) {
    return new Response("Forbidden", { status: 403 });
  }
  return null;
}

export function isSafeSlug(s: unknown): s is string {
  return typeof s === "string" && /^[a-z0-9-]+$/.test(s);
}
