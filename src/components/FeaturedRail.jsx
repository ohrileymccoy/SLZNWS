import { useEffect, useState, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function FeaturedRail({ speed = 40, fastSpeed = 5, pauseOnHover = true }) {
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

  const repeatCount = 3;
  const looped = Array.from({ length: repeatCount }).flatMap(() => items);

  // Base marquee animation
  const marqueeAnim = (duration = speed, direction = "right") => ({
    x: direction === "right" ? ["0%", "-50%"] : ["-50%", "0%"],
    transition: { repeat: Infinity, duration, ease: "linear" },
  });

  // Hover handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) controls.stop();
  };
  const handleMouseLeave = () => {
    if (pauseOnHover) controls.start(marqueeAnim());
  };

  // Start scrolling when items load
  useEffect(() => {
    if (items.length > 0) {
      controls.start(marqueeAnim());
    }
  }, [items]);

  // Arrow handler = speed burst
  const handleArrow = (direction) => {
    // Stop current slow scroll
    controls.stop();

    // Burst scroll
    controls.start(
      marqueeAnim(fastSpeed, direction === "right" ? "right" : "left")
    );

    // After 2 seconds, return to normal slow scroll
    setTimeout(() => {
      controls.start(marqueeAnim(speed, "right"));
    }, 2000);
  };

  return (
    <section className="mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-3 relative group">
        <h2 className="relative text-lg font-semibold text-neutral-100 pb-1 transition-all duration-300">
          <span className="relative z-10 group-hover:text-white">Local Mugshots</span>
          <span className="absolute inset-0 rounded-lg bg-neutral-800/80 shadow-lg opacity-0 scale-90 
                           group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
        </h2>
      </div>

      {/* Carousel with arrows outside */}
      <div className="relative flex items-center">
        {/* Left arrow */}
        <button
          onClick={() => handleArrow("left")}
          className="absolute -left-10 z-20 bg-neutral-900/70 hover:bg-neutral-800 text-white text-3xl rounded-full shadow-[0_0_15px_#0ff] px-3 py-1"
        >
          ‹
        </button>

        {/* Scrolling container */}
        <div
          className="overflow-hidden flex-1"
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

        {/* Right arrow */}
        <button
          onClick={() => handleArrow("right")}
          className="absolute -right-10 z-20 bg-neutral-900/70 hover:bg-neutral-800 text-white text-3xl rounded-full shadow-[0_0_15px_#0ff] px-3 py-1"
        >
          ›
        </button>
      </div>
    </section>
  );
}
