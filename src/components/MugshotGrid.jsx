import { useEffect, useState } from "react";

export default function MugshotGrid() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/v1/mugshots/list");
      const json = await res.json();
      setItems(json.items || []);
    } catch (err) {
      console.error("Failed to load mugshots:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this mugshot?")) return;
    try {
      await fetch("/api/v1/mugshots/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <p>Loading mugshots…</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <div
          key={it.id}
          className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden"
        >
          <img
            src={it.public_url}
            alt={it.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-2 text-center">
            <p className="text-sm text-neutral-300">{it.name}</p>
            <button
              onClick={() => handleDelete(it.id)}
              className="mt-2 px-3 py-1 text-xs rounded bg-red-600 hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
