// src/components/VideoGrid.jsx
import { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard.jsx";

// Keep in sync with backend allowed values
const SECTIONS = ["news", "culture", "sports", "featured"];

export default function VideoGrid({ adminMode = false }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load videos from API (public vs admin)
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams({
          limit: adminMode ? "50" : "12",
        });
        if (adminMode) qs.set("all", "true"); // admin sees unpublished

        const res = await fetch(`/api/v1/videos?${qs.toString()}`);
        if (!res.ok) throw new Error(`API ${res.status}`);

        const json = await res.json();
        setVideos(Array.isArray(json.items) ? json.items : []);
      } catch (err) {
        setError(err.message || "Failed to load");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [adminMode]);

// Admin: change section
async function updateSection(slug, newSection) {
  try {
    const res = await fetch("/api/v1/videos/update_section", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ slug, section: newSection }),
    });

    const out = await res.json();
    if (!out.ok) {
      return alert(out.error || "Failed to update section");
    }

    setVideos((prev) =>
      prev.map((v) =>
        v.slug === slug ? { ...v, section: newSection } : v
      )
    );
  } catch (err) {
    alert("Update failed: " + err.message);
  }
}

// Admin: approve for publication
async function handleApprove(slug) {
  try {
    const res = await fetch("/api/v1/videos/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
      body: JSON.stringify({ slug }),
    });
    const out = await res.json();
    if (!out.ok) return alert(out.error || "Failed to approve");

    setVideos((prev) =>
      prev.map((v) =>
        v.slug === slug ? { ...v, is_published: 1, status: "ready" } : v
      )
    );
  } catch (err) {
    alert("Approve failed: " + (err instanceof Error ? err.message : String(err)));
  }
}

  // Admin: delete video
async function handleDelete(video) {
  if (!confirm("Delete this video?")) return;
  try {
    const res = await fetch("/api/v1/videos/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
    alert("Delete failed: " + (err instanceof Error ? err.message : String(err)));
  }
}


  // --- Render states ---
  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!videos.length) return <p className="text-sm text-neutral-500">No videos yet.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => {
        const published = Number(v.is_published) === 1 || v.is_published === true;
        const ready = (v.status || "").toLowerCase() === "ready";

        return (
          <li key={v.id} className="relative group">
            {/* Moderation badge (admin only) */}
            {adminMode && (
              <span
                className={`absolute z-10 top-2 right-2 px-2 py-0.5 rounded text-[10px] border
                  ${
                    published
                      ? "bg-green-900/40 border-green-700 text-green-300"
                      : "bg-yellow-900/40 border-yellow-700 text-yellow-300"
                  }`}
              >
                {published ? "Published" : "Pending"}
              </span>
            )}

            <ArticleCard
              title={v.title || v.slug}
              eyebrow={v.section || "Video"}
              videoUrl={v.public_url}
              posterUrl={v.poster_url || v.poster_key || undefined}
              caption={v.caption}
              mime={v.mime}
              // Keep /article/:id route working
              videoId={v.id}
              onDelete={adminMode ? () => handleDelete(v) : undefined}
            />

            {/* Admin controls */}
            {adminMode && (
              <div className="mt-2 flex items-center justify-between gap-2">
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

                <div className="flex gap-2">
                  {(!published || !ready) && (
                    <button
                      onClick={() => handleApprove(v.slug)}
                      className="px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      ✅ Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(v)}
                    className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
