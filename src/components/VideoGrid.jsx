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

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-400">{error}</p>;
  if (!videos.length) return <p className="text-sm text-neutral-500">No videos yet.</p>;

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((v) => (
        <li key={v.id}>
          <ArticleCard
            title={v.title || v.slug}
            eyebrow="Video"
            videoUrl={v.public_url}
            posterUrl={v.poster_url}
            mime={v.mime}
          />
        </li>
      ))}
    </ul>
  );
}
