// functions/api/v1/photos/delete_photos.ts

export interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Explicitly type the incoming body
  const { id } = (await request.json()) as { id: number };

  // Fetch keys so we can delete from R2
  const row = await env.DB.prepare("SELECT r2_keys FROM photos WHERE id=?1")
    .bind(id)
    .first<{ r2_keys: string }>();

  if (row) {
    const keys = JSON.parse(row.r2_keys) as string[];
    for (const k of keys) {
      await env.MEDIA.delete(k);
    }
  }

  await env.DB.prepare("DELETE FROM photos WHERE id=?1").bind(id).run();

  return Response.json({ ok: true });
};
