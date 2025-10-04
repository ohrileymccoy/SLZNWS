// src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";
import { SECTION_LABELS } from "../constants/sections";

export default function SearchPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("newest"); // "newest" | "photos" | "videos"

  useEffect(() => {
    async function load() {
      if (!query) {
        setItems([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/v1/search?q=${encodeURIComponent(query)}`);
        const json = await res.json();
        if (json.ok) {
          setItems(json.items || []);
        } else {
          setError(json.error || "Search failed");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">Searching for “{query}”…</p>
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
        <p className="text-neutral-400">No results found for “{query}”.</p>
      </div>
    );
  }

  // 🔑 Filter + sort logic (same as Feed.jsx)
  let filtered = [...items];

  if (filter === "photos") {
    filtered = filtered.filter((it) => it.type === "photo");
  } else if (filter === "videos") {
    filtered = filtered.filter((it) => it.type === "video");
  }

  filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h2 className="text-xl font-semibold mb-4">
        Search results for “{query}”
      </h2>

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
            eyebrow={SECTION_LABELS[it.section] || it.section}
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
            eyebrow={SECTION_LABELS[it.section] || it.section}
            caption={it.caption}
            footer={`Uploaded ${new Date(it.created_at).toLocaleDateString()}`}
            photoUrls={JSON.parse(it.r2_keys || "[]")}
            photoId={it.id}
          />
        )
      )}
    </div>
  );
}
