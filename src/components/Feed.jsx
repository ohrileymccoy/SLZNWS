import { useVideos } from "../hooks/useVideos";
import ArticleCard from "./ArticleCard";

export default function Feed({ section = null }) {
  const { items, loading } = useVideos({ section });

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">Loading videos…</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">No videos found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      {items.map((it) => (
     <ArticleCard
  key={it.id}
  title={it.title}
  eyebrow={it.section}
  videoUrl={it.public_url}
  posterUrl={it.poster_key}
  caption={it.caption}
  footer={`Uploaded ${new Date(it.created_at).toLocaleDateString()}`}
  videoId={it.id}   // 👈 pass the DB id
/>

      ))}
    </div>
  );
}
