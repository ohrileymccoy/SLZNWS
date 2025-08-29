export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  VIDEOS_BUCKET: R2Bucket;
}

import { handleUpload } from "./api/v1/upload";
import { handleList }   from "./api/v1/list";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Local R2 proxy
    if (url.pathname.startsWith("/r2/")) {
      const key = url.pathname.replace(/^\/r2\//, "");
      const obj = await env.VIDEOS_BUCKET.get(key);
      if (!obj) return new Response("Not found", { status: 404 });
      return new Response(obj.body, {
        headers: {
          "Content-Type": obj.httpMetadata?.contentType || "video/mp4",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // 2. API routes
    if (url.pathname.startsWith("/api/")) {
      if (url.pathname === "/api/v1/videos/upload" && request.method === "POST") {
        return handleUpload(request, env);
      }
      if (url.pathname === "/api/v1/videos" && request.method === "GET") {
        return handleList(request, env);
      }

      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Everything else → static assets / SPA fallback
    return env.ASSETS.fetch(request);
  }
};
