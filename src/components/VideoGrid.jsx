// src/components/VideoGrid.jsx
import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard.jsx";

export default function VideoGrid() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_SECRET || ""; // injected at build for /admin

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/v1/videos?status=uploaded&limit=12`);
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
      const res = await fetch(`${API_BASE}/api/v1/videos/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ id: video.id, slug: video.slug }),
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

  async function handleSectionChange(video, newSection) {
    try {
      const res = await fetch(`${API_BASE}/api/v1/videos/update_section`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify({ slug: video.slug, section: newSection }),
      });
      const json = await res.json();

      if (json.ok) {
        setVideos((prev) =>
          prev.map((v) =>
            v.id === video.id ? { ...v, section: newSection } : v
          )
        );
      } else {
        alert("Update failed: " + (json.error || "Unknown error"));
      }
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!videos.length) return <p className="text-sm text-neutral-500">No videos yet.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id} className="relative group border border-neutral-800 rounded-lg p-2">
          {/* Video card */}
          <ArticleCard
            title={v.title || v.slug}
            eyebrow={v.section || "Video"}
            videoUrl={v.public_url}
            posterUrl={v.poster_url}
            caption={v.caption}
            mime={v.mime}
          />

          {/* Section dropdown */}
          <div className="mt-2">
            <label className="text-xs text-neutral-400 mr-2">Section:</label>
            <select
              value={v.section || "news"}
              onChange={(e) => handleSectionChange(v, e.target.value)}
              className="text-sm rounded border border-neutral-700 bg-neutral-900 text-neutral-100 px-2 py-1"
            >
              <option value="news">News</option>
              <option value="culture">Culture</option>
              <option value="sports">Sports</option>
            </select>
          </div>

          {/* Delete button (hover) */}
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
