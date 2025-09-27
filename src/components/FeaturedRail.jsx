import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function FeaturedRail({
  baseDuration = 25,   // baseline seconds for one full loop
  burstDuration = 8,   // seconds for fast scroll
  pauseOnHover = true,
}) {
  const [items, setItems] = useState([]);
  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const [running, setRunning] = useState(true);
  const [duration, setDuration] = useState(baseDuration);

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

  // duplicate items so loop is seamless
  const repeatCount = 3;
  const looped = Array.from({ length: repeatCount }).flatMap(() => items);

  // Calculate speed (px/frame) based on track width and duration
  const getSpeed = () => {
    const track = trackRef.current;
    if (!track) return 1;
    const loopWidth = track.scrollWidth / 2; // since we repeat items
    return loopWidth / (duration * 60); // px per frame, assuming 60fps
  };

  // RAF loop
  useEffect(() => {
    const tick = () => {
      if (running && trackRef.current) {
        const track = trackRef.current;
        const loopWidth = track.scrollWidth / 2;
        const newX = x.get() - getSpeed();

        // wrap seamlessly when half the track is scrolled
        if (Math.abs(newX) >= loopWidth) {
          x.set(0);
        } else {
          x.set(newX);
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, duration]);

  // Hover pause/resume
  const handleMouseEnter = () => pauseOnHover && setRunning(false);
  const handleMouseLeave = () => pauseOnHover && setRunning(true);

  // Arrow click = proportional nudge + burst speed
  const handleArrow = (direction) => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const loopWidth = track.scrollWidth / 2;

    // nudge by 10% of loop width
    const nudge = loopWidth * 0.1;
    x.set(x.get() + (direction === "right" ? -nudge : nudge));

    // temporary speed burst
    setDuration(burstDuration);
    setTimeout(() => setDuration(baseDuration), 2000);
  };

  return (
    <section className="mb-8">
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
              ref={trackRef}
              className="flex gap-3"
              style={{ x }}
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
