// src/components/Comments.jsx
import { useEffect, useState } from "react";

export default function Comments({ videoId, photoId }) {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  // Load comments
  useEffect(() => {
    async function load() {
      try {
        const qs = new URLSearchParams();
        if (videoId) qs.set("video_id", videoId);
        if (photoId) qs.set("photo_id", photoId);

        const res = await fetch(`/api/v1/comments?${qs.toString()}`);
        const data = await res.json();
        if (data.ok) setComments(data.comments || []);
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [videoId, photoId]);

  // Submit comment
  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitting comment…", { videoId, photoId, username, body });

    try {
      const res = await fetch("/api/v1/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_id: videoId || null,
          photo_id: photoId || null,
          username,
          body,
        }),
      });
      const data = await res.json();
      console.log("Response status:", res.status);
      console.log("Response JSON:", data);

      if (data.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setBody("");
      } else {
        alert("Failed to post comment: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  }

  return (
    <section className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Comments</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-sm"
          required
        />
        <textarea
          placeholder="Write a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700 text-sm"
          rows={3}
          required
        />
        <button
          type="submit"
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
        >
          Post
        </button>
      </form>

      {loading ? (
        <p className="text-neutral-400">Loading comments…</p>
      ) : comments.length === 0 ? (
        <p className="text-neutral-400">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="p-2 bg-neutral-900 rounded border border-neutral-800"
            >
              <p className="text-sm font-semibold text-neutral-300">
                {c.username}
              </p>
              <p className="text-sm text-neutral-400">{c.body}</p>
              <p className="text-xs text-neutral-500">
                {new Date(c.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
