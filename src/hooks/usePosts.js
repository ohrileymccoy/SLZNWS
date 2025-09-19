// src/hooks/usePosts.js
import { useEffect, useState } from "react";

export function usePosts({ section = null } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const qs = new URLSearchParams({ limit: "50" });
        if (section) qs.set("section", section);

        const res = await fetch(`/api/v1/posts/list?${qs.toString()}`);
        if (!res.ok) throw new Error(`API ${res.status}`);

        const json = await res.json();
        setItems(Array.isArray(json.items) ? json.items : []);
      } catch (err) {
        setError(err.message || "Failed to load posts");
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [section]);

  return { items, loading, error };
}
