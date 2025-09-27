import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function FeaturedRail({ speed = 40, pauseOnHover = true }) {
  const [items, setItems] = useState([]);
  const controls = useAnimation();
  const containerRef = useRef(null);

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
  const repeatCount = 3;
  const looped = Array.from({ length: repeatCount }).flatMap(() => items);

  // Motion config
  const marqueeAnim = {
    x: ["0%", "-50%"],
    transition: { repeat: Infinity, duration: speed, ease: "linear" },
  };

  // Hover handlers (pause/resume)
  const handleMouseEnter = () => {
    if (pauseOnHover) controls.stop();
  };
  const handleMouseLeave = () => {
    if (pauseOnHover) controls.start(marqueeAnim);
  };

  // Start animation on mount
  useEffect(() => {
    if (items.length > 0) {
      controls.start(marqueeAnim);
    }
  }, [items]);

  // Manual arrow scroll (nudge left/right)
  const handleArrow = (direction) => {
    controls.stop();
    controls.start({
      x: direction === "left" ? "+=200" : "-=200", // nudge 200px
      transition: { duration: 0.4, ease: "easeOut" },
    });
  };

  return (
    <section className="mb-8 overflow-hidden relative">
      <div className="flex items-center justify-between mb-3 relative group">
        <h2 className="relative text-lg font-semibold text-neutral-100 pb-1 transition-all duration-300">
          <span className="relative z-10 group-hover:text-white">Local Mugshots</span>
          <span className="absolute inset-0 rounded-lg bg-neutral-800/80 shadow-lg opacity-0 scale-90 
                           group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
        </h2>
      </div>

      {/* Arrows */}
      <button
        onClick={() => handleArrow("left")}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/70 hover:bg-neutral-800 text-white text-3xl rounded-full shadow-[0_0_15px_#0ff] px-3 py-1"
      >
        ‹
      </button>
      <button
        onClick={() => handleArrow("right")}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-neutral-900/70 hover:bg-neutral-800 text-white text-3xl rounded-full shadow-[0_0_15px_#0ff] px-3 py-1"
      >
        ›
      </button>

      <div
        className="overflow-hidden"
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div className="flex gap-3" animate={controls}>
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
        </motion.div>
      </div>
    </section>
  );
}
