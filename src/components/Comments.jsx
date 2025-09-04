import { useEffect, useState } from "react";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState("");
  const [body, setBody] = useState("");

  async function fetchComments() {
  try {
    const res = await fetch(`/api/v1/comments?video_id=${videoId}`);
    const data = await res.json();
    if (data.ok) {
      setComments(data.comments);
    } else {
      console.error("Failed to load comments:", data.error);
    }
  } catch (err) {
    console.error("Network error:", err);
  }
}


  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("/api/v1/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ video_id: videoId, username, body }),
    });
    setBody("");
    fetchComments();
  }

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div className="mt-6 space-y-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700"
          maxLength={32}
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Say something..."
          required
          className="w-full px-3 py-2 rounded bg-neutral-900 border border-neutral-700"
          maxLength={1000}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded hover:bg-neutral-700"
        >
          Post
        </button>
      </form>

      <ul className="space-y-3">
        {comments.map((c) => (
          <li key={c.id} className="p-3 bg-neutral-900 rounded border border-neutral-800">
            <p className="text-sm text-neutral-400">
              {c.username} — {new Date(c.created_at).toLocaleString()}
            </p>
            <p>{c.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
