import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

export default function FeaturedRail({
  speed = 40,
  fastSpeed = 5,
  pauseOnHover = true,
}) {
  const [items, setItems] = useState([]);
  const controls = useAnimation();

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

  // Duplicate items so ticker never ends
  const repeatCount = 3;
  const looped = Array.from({ length: repeatCount }).flatMap(() => items);

  // Base marquee animation
  const marqueeAnim = (duration = speed, direction = "right") => ({
    x: direction === "right" ? ["0%", "-50%"] : ["-50%", "0%"],
    transition: { repeat: Infinity, duration, ease: "linear" },
  });

  // Hover pause
  const handleMouseEnter = () => pauseOnHover && controls.stop();
  const handleMouseLeave = () => pauseOnHover && controls.start(marqueeAnim());

  // Start default scroll
  useEffect(() => {
    if (items.length > 0) {
      controls.start(marqueeAnim());
    }
  }, [items]);

  // Arrow = burst speed
  const handleArrow = (direction) => {
    controls.stop();
    controls.start(
      marqueeAnim(fastSpeed, direction === "right" ? "right" : "left")
    );
    setTimeout(() => {
      controls.start(marqueeAnim(speed, "right"));
    }, 2000);
  };

  return (
    <section className="mb-8">
      {/* Chyron frame */}
      <div className="bg-neutral-950/90 border-y-2 border-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
        {/* Title strip */}
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-200 tracking-wide uppercase">
            Local Mugshots
          </h2>
        </div>

        {/* Ticker row with arrows */}
        <div className="relative flex items-center h-44 overflow-hidden">
          {/* Left arrow */}
          <button
            onClick={() => handleArrow("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                       bg-neutral-900/80 hover:bg-neutral-800 text-white text-2xl 
                       rounded-full shadow-[0_0_15px_#0ff] px-2 py-1"
          >
            ‹
          </button>

          {/* Scrolling content */}
          <div
            className="overflow-hidden flex-1"
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
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-1 text-center">
                    <p className="text-xs text-neutral-300">{it.name}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right arrow */}
          <button
            onClick={() => handleArrow("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                       bg-neutral-900/80 hover:bg-neutral-800 text-white text-2xl 
                       rounded-full shadow-[0_0_15px_#0ff] px-2 py-1"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
