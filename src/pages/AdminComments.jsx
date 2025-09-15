import { useEffect, useState } from "react";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0); // force reload

  async function fetchAllComments() {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/v1/comments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // 🔒 admin required
        },
      });
      const data = await res.json();

      if (data.ok) {
        setComments(data.comments || []);
      } else {
        setError(data.error || "Failed to load comments");
      }
    } catch (err) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch("/api/v1/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Delete failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  useEffect(() => {
    fetchAllComments();
  }, [refreshNonce]); // reload when refreshNonce changes

  if (loading) return <p className="p-4 text-neutral-400">Loading comments…</p>;
  if (error) return <p className="p-4 text-red-400">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">All Comments</h1>
        <button
          onClick={() => setRefreshNonce((n) => n + 1)}
          className="px-2 py-1 rounded border border-neutral-700 text-xs hover:bg-neutral-900"
          title="Refresh"
        >
          ↻ Refresh
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="text-neutral-400">No comments found.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li
              key={c.id}
              className="p-3 bg-neutral-900 rounded border border-neutral-800 flex justify-between items-start"
            >
              <div>
                <p className="text-sm text-neutral-400">
                  {c.username} — {new Date(c.created_at).toLocaleString()}
                </p>
                {c.title || c.slug ? (
                  <p className="text-xs text-neutral-500">
                    on video: {c.title || c.slug} (ID {c.video_id})
                  </p>
                ) : (
                  <p className="text-xs text-neutral-500">video ID {c.video_id}</p>
                )}
                <p>{c.body}</p>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="ml-4 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
              >
                🗑 Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
