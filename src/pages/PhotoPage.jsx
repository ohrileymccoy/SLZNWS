import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function PhotoPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/v1/photos/get?id=${id}`);
        const json = await res.json();
        setItem(json.item || null);

        const relRes = await fetch("/api/v1/photos/list");
        const relJson = await relRes.json();
        if (relJson.items) {
          setRelated(relJson.items.filter((p) => String(p.id) !== String(id)));
        }
      } catch (err) {
        console.error("Failed to load photo post:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-neutral-400">
        Loading photo post…
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-neutral-400">
        Photo not found.
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
      {item.caption && (
        <p className="text-neutral-400 mb-4">{item.caption}</p>
      )}

      <div className="grid gap-2 sm:grid-cols-2 mb-6">
        {item.photoUrls.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={item.title || `photo-${i}`}
            className="w-full rounded-lg object-cover"
          />
        ))}
      </div>

      <div className="text-xs text-neutral-500 mb-10">
        Uploaded {new Date(item.created_at).toLocaleString()}
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">More photo posts</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.slice(0, 4).map((p) => (
              <Link
                key={p.id}
                to={`/photo/${p.id}`}
                className="block rounded-xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 overflow-hidden"
              >
                <img
                  src={p.photoUrls[0]}
                  alt={p.title || ""}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2">
                  <h3 className="text-sm font-semibold line-clamp-1">
                    {p.title || "Untitled"}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {p.caption || ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
