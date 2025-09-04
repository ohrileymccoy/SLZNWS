import { useEffect, useState } from "react";

export default function CommentPreview({ videoId }) {
  const [comment, setComment] = useState(null);

  useEffect(() => {
    async function fetchPreview() {
      try {
        const res = await fetch(`/api/v1/comments?video_id=${videoId}&limit=1`);
        const data = await res.json();
        if (data.ok && data.comments.length > 0) {
          setComment(data.comments[0]);
        }
      } catch (err) {
        console.error("Failed to fetch preview comment:", err);
      }
    }
    fetchPreview();
  }, [videoId]);

  if (!comment) return null;

  return (
    <div className="mt-2 text-xs text-neutral-400 italic">
      “{comment.body.slice(0, 80)}
      {comment.body.length > 80 ? "…" : ""}” — {comment.username}
    </div>
  );
}
