// src/components/FeaturedRail.jsx
import { useEffect, useState, useRef } from "react";

export default function FeaturedRail() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/mugshots/list");
        const json = await res.json();
        setItems(json.items || []);
      } catch (err) {
        console.error("Failed to load mugshots:", err);
        setError("Failed to load mugshots.");
      }
    }
    load();
  }, []);

  if (!mounted) return null;
  if (error)
    return <section className="p-6 text-center text-sm text-red-400">{error}</section>;
  if (!items.length)
    return <section className="p-6 text-center text-sm text-neutral-500">Loading mugshots…</section>;

  // simple auto-scroll via CSS keyframes only
  return (
    <section className="mb-8">
      <div className="bg-neutral-950/90 border-y-2 border-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-200 tracking-wide uppercase">
            Local Mugshots
          </h2>
        </div>
        <div className="relative h-44 overflow-hidden">
          <div ref={trackRef} className="flex gap-3 animate-marquee">
            {items.concat(items, items).map((it, idx) => (
              <div key={idx} className="min-w-[160px] bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden">
                <img
                  src={it.public_url}
                  alt={it.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-1 text-center">
                  <p className="text-xs font-medium text-neutral-200">{it.name}</p>
                  {it.stats && <p className="text-[11px] text-neutral-400">{it.stats}</p>}
                  {it.charges && (
                    <p className="text-[10px] text-red-400 line-clamp-2">{it.charges}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
