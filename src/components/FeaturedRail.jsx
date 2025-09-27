import { useEffect, useState } from "react";
import { motion, useAnimation, useMotionValue } from "framer-motion";

export default function FeaturedRail({
  speed = 25, // slightly faster baseline
  fastSpeed = 8,
  pauseOnHover = true,
}) {
  const [items, setItems] = useState([]);
  const controls = useAnimation();
  const x = useMotionValue(0); // track horizontal offset

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

  // Continuous marquee animation from current x
  const startMarquee = (duration = speed, direction = "right") => {
    const distance = -50; // move by -50% of width
    controls.start({
      x: [x.get(), `${distance}%`],
      transition: { repeat: Infinity, duration, ease: "linear" },
    });
  };

  const handleMouseEnter = () => pauseOnHover && controls.stop();
  const handleMouseLeave = () => pauseOnHover && startMarquee();

  useEffect(() => {
    if (items.length > 0) {
      startMarquee();
    }
  }, [items]);

  const handleArrow = (direction) => {
    controls.stop();
    startMarquee(fastSpeed, direction);
    setTimeout(() => startMarquee(speed, "right"), 2000);
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

        {/* Ticker row */}
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
            <motion.div
              className="flex gap-3"
              animate={controls}
              style={{ x }} // bind motionValue
            >
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
