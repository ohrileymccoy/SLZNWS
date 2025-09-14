import { useEffect, useState } from "react";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAllComments() {
    try {
      setLoading(true);
      setError("");
      // Fetch all comments (no video_id filter)
      const res = await fetch("/api/v1/comments?video_id=0"); 
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
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`, // 🔒 protect like videos
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
  }, []);

  if (loading) return <p className="p-4 text-neutral-400">Loading comments…</p>;
  if (error) return <p className="p-4 text-red-400">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold mb-4">All Comments</h1>
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
