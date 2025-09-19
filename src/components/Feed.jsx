import { usePosts } from "../hooks/usePosts";
import ArticleCard from "./ArticleCard";

export default function Feed({ section = null }) {
  const { items, loading, error } = usePosts({ section });

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">Loading feed…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      {items.map((it) =>
        it.type === "video" ? (
          <ArticleCard
            key={`video-${it.id}`}
            title={it.title}
            eyebrow={it.section}
            videoUrl={it.public_url}
            posterUrl={it.poster_key}
            caption={it.caption}
            footer={`Uploaded ${new Date(it.created_at).toLocaleDateString()}`}
            videoId={it.id}
          />
        ) : (
          <ArticleCard
            key={`photo-${it.id}`}
            title={it.title}
            eyebrow={it.section}
            caption={it.caption}
            footer={`Uploaded ${new Date(it.created_at).toLocaleDateString()}`}
            photoUrls={it.photoUrls}
            photoId={it.id}
          />
        )
      )}
    </div>
  );
}
