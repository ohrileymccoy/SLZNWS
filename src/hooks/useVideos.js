import { useEffect, useState } from "react";

export function useVideos({ section }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "/api/v1/videos";
    if (section) url += `?section=${encodeURIComponent(section)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [section]);

  return { items, loading };
}
