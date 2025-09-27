import { useEffect, useState } from "react";

export default function FeaturedRail() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/v1/mugshots/list");
        const json = await res.json();
        setItems(json.items || []);
      } catch (err) {
        console.error("Failed to load mugshots:", err);
      }
    }
    load();
  }, []);

  // Duplicate items to guarantee continuous loop
  const repeatCount = 3; // adjust as needed
  const looped = Array.from({ length: repeatCount }).flatMap(() => items);

  return (
    <section className="mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-3 relative group">
        <h2 className="relative text-lg font-semibold text-neutral-100 pb-1 transition-all duration-300">
          <span className="relative z-10 group-hover:text-white">Local Mugshots</span>
          <span className="absolute inset-0 rounded-lg bg-neutral-800/80 shadow-lg opacity-0 scale-90 
                           group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
        </h2>
      </div>

      {/* Marquee wrapper */}
      <div className="overflow-hidden">
        <div className="marquee">
          {looped.map((it, idx) => (
            <div
              key={idx}
              className="min-w-[160px] bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              <img
                src={it.public_url}
                alt={it.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-neutral-300">{it.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
