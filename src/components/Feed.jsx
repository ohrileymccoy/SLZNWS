import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import ArticleCard from "./ArticleCard";

export default function Feed({ section = null }) {
  const { items, loading, error } = usePosts({ section });
  const [filter, setFilter] = useState("newest"); // "newest" | "photos" | "videos"

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

  // 🔑 Filter + sort logic
  let filtered = [...items];

  if (filter === "photos") {
    filtered = filtered.filter((it) => it.type === "photo");
  } else if (filter === "videos") {
    filtered = filtered.filter((it) => it.type === "video");
  }

  // Always sort newest first
  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="mx-auto max-w-3xl px-4">
      {/* Filter controls */}
      <div className="flex justify-end mb-4">
        <label className="text-sm text-neutral-400 mr-2">Show:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm text-neutral-200"
        >
          <option value="newest">Newest</option>
          <option value="videos">Videos only</option>
          <option value="photos">Photos only</option>
        </select>
      </div>

      {filtered.map((it) =>
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
