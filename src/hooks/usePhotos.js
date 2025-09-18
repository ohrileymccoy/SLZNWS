// src/hooks/usePhotos.js
import { useEffect, useState } from "react";

export function usePhotos({ section = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/photos/list_photos");
        const json = await res.json();
        let photos = (json.items || []).map((p) => ({
          id: `photo-${p.id}`,
          type: "photo",
          title: p.title,
          caption: p.caption,
          section: p.section,
          created_at: p.created_at,
          photoUrls: p.photoUrls,
        }));

        if (section) {
          photos = photos.filter((it) => it.section === section);
        }
        setItems(photos);
      } catch (err) {
        console.error("Failed to load photos", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [section]);

  return { items, loading };
}
