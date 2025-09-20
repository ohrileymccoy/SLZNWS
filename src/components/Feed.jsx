import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import ArticleCard from "./ArticleCard";

export default function Feed({ section = null }) {
  const { items, loading, error } = usePosts({ section });
  const [sortBy, setSortBy] = useState("date"); // "date" | "type"

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

  // 🔑 Sorting logic lives here
  let sorted = [...items];
  if (sortBy === "date") {
    sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortBy === "type") {
    sorted.sort((a, b) => {
      if (a.type === b.type) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return a.type === "video" ? -1 : 1; // videos before photos
    });
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      {/* Sort controls */}
      <div className="flex justify-end mb-4">
        <label className="text-sm text-neutral-400 mr-2">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm text-neutral-200"
        >
          <option value="date">Newest</option>
          <option value="type">Type</option>
        </select>
      </div>

      {sorted.map((it) =>
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
