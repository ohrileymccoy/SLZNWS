// src/components/CommentPreview.jsx
import { useEffect, useState } from "react";

export default function CommentPreview({ videoId, photoId }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function fetchPreview() {
      try {
        const qs = new URLSearchParams();
        if (videoId) qs.set("video_id", videoId);
        if (photoId) qs.set("photo_id", photoId);
        qs.set("limit", "2"); // fetch top 2 comments

        const res = await fetch(`/api/v1/comments?${qs.toString()}`);
        const data = await res.json();
        if (data.ok && data.comments.length > 0) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Failed to fetch preview comments:", err);
      }
    }
    fetchPreview();
  }, [videoId, photoId]);

  if (!comments.length) return null;

  return (
    <div className="mt-2 space-y-2">
      {comments.map((c) => (
        <div
          key={c.id}
          className="px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700"
        >
          <p className="text-xs text-neutral-300 font-medium">{c.username}</p>
          <p className="text-xs text-neutral-400 truncate">
            {c.body.length > 80 ? c.body.slice(0, 80) + "…" : c.body}
          </p>
        </div>
      ))}
    </div>
  );
}
