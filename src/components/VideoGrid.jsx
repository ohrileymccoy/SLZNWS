import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard.jsx";

// Only add secret header if in admin mode
const ADMIN_BEARER =
  import.meta.env.VITE_ADMIN_SECRET ? `Bearer ${import.meta.env.VITE_ADMIN_SECRET}` : "";

// Allowed section values
const SECTIONS = ["news", "culture", "sports"];

export default function VideoGrid({ adminMode = false }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load videos from API
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const API_BASE = import.meta.env.VITE_API_BASE || "";
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

  // Update section handler (admin only)
  async function updateSection(slug, newSection) {
    try {
      const res = await fetch("/api/v1/videos/update-section", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminMode && ADMIN_BEARER ? { Authorization: ADMIN_BEARER } : {}),
        },
        body: JSON.stringify({ slug, section: newSection }),
      });
      const out = await res.json();
      if (!out.ok) {
        alert(out.error || "Failed to update section");
        return;
      }
      // update state
      setVideos((prev) =>
        prev.map((v) => (v.slug === slug ? { ...v, section: newSection } : v))
      );
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  }

  // Delete handler (admin only)
  async function handleDelete(video) {
    if (!confirm("Delete this video?")) return;
    try {
      const res = await fetch("/api/v1/videos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(adminMode && ADMIN_BEARER ? { Authorization: ADMIN_BEARER } : {}),
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

  // --- Render states ---
  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!videos.length) return <p className="text-sm text-neutral-500">No videos yet.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id} className="relative group">
          <ArticleCard
            title={v.title || v.slug}
            eyebrow={v.section || "Video"}
            videoUrl={v.public_url}
            posterUrl={v.poster_url}
            caption={v.caption}
            mime={v.mime}
            onDelete={adminMode ? () => handleDelete(v) : undefined}
          />

          {/* Admin controls */}
          {adminMode && (
            <>
              {/* Section dropdown */}
              <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition">
                <select
                  className="px-2 py-1 rounded bg-neutral-800 border border-neutral-600 text-xs text-white"
                  value={v.section || "news"}
                  onChange={(e) => updateSection(v.slug, e.target.value)}
                >
                  {SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s[0].toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delete button */}
              <button
                onClick={() => handleDelete(v)}
                className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 transition"
              >
                🗑 Delete
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
