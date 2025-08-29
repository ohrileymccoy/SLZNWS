// src/components/VideoGrid.jsx
import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard.jsx";

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/videos?status=uploaded&limit=12");
        if (!res.ok) throw new Error(`API ${res.status}`);
        const json = await res.json();
        setVideos(json.items || []);
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
async function handleDelete(video) {
  if (!confirm("Delete this video?")) return;

  try {
    const res = await fetch("/api/v1/videos/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: video.id, slug: video.slug }), // send both
    });
    const json = await res.json();

    if (json.ok) {
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } else {
      alert("Delete failed: " + (json.error || "Unknown error"));
    }
  } catch (err) {
    alert("Delete failed: " + err.message);
  }
}


  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!videos.length) return <p className="text-sm text-neutral-500">No videos yet.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id} className="relative group">
          {/* Video card */}
          <ArticleCard
            title={v.title || v.slug}
            eyebrow="Video"
            videoUrl={v.public_url}
            posterUrl={v.poster_url}
            mime={v.mime}
          />

          {/* Delete button (appears on hover) */}
          <button
  onClick={() => handleDelete(v)}
  className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
>
  🗑 Delete
</button>

        </li>
      ))}
    </ul>
  );
}
