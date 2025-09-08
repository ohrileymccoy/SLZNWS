// src/pages/ArticlePage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Comments from "../components/Comments.jsx";

export default function ArticlePage() {
  const { id } = useParams();            // URL param from /article/:id
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/v1/videos?id=${id}`);
        const data = await res.json();
        if (data.ok && data.item) {
          setVideo(data.item);
        }
      } catch (err) {
        console.error("Failed to fetch video:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [id]);

  if (loading) {
    return <p className="text-neutral-400 p-6">Loading…</p>;
  }

  if (!video) {
    return <p className="text-red-400 p-6">Video not found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <video
        src={video.public_url}
        controls
        className="w-full rounded-xl"
        poster={video.poster_url || undefined}
      />
      <h1 className="text-2xl font-bold">{video.title}</h1>
      {video.caption && (
        <p className="text-neutral-400">{video.caption}</p>
      )}

      {/* Full comment thread + form */}
      <Comments videoId={video.id} />
    </div>
  );
}
