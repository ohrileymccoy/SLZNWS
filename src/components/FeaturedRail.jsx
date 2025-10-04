// src/components/FeaturedRail.jsx
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";

export default function FeaturedRail({
  baseDuration = 25,
  burstDuration = 8,
  pauseOnHover = true,
}) {
  const [items, setItems] = useState([]);
  const [loopWidth, setLoopWidth] = useState(0);
  const [useCSSFallback, setUseCSSFallback] = useState(false);

  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const frameRef = useRef(null);

  const [running, setRunning] = useState(true);
  const [duration, setDuration] = useState(baseDuration);
  const [direction, setDirection] = useState("right");

  // -------- Fetch data --------
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

  // -------- Measure width safely --------
  useEffect(() => {
    if (!trackRef.current) return;
    const raf = requestAnimationFrame(() => {
      if (trackRef.current) {
        const width = trackRef.current.scrollWidth / 2;
        setLoopWidth(width);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [items]);

  // -------- Detect Safari / fallback --------
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/safari/.test(ua) && !/chrome/.test(ua)) {
      // if no rAF or motion update bug detected later, fallback
      if (!window.requestAnimationFrame) setUseCSSFallback(true);
    }
  }, []);

  // -------- Main animation loop --------
  useEffect(() => {
    if (useCSSFallback) return;
    const tick = () => {
      if (
        !running ||
        !trackRef.current ||
        document.visibilityState !== "visible" ||
        !loopWidth
      ) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      const speed = loopWidth / (duration * 60); // px per frame
      const delta = speed * (direction === "right" ? -1 : 1);
      let newX = x.get() + delta;

      if (direction === "right" && Math.abs(newX) >= loopWidth) {
        x.set(0);
      } else if (direction === "left" && newX > 0) {
        x.set(-loopWidth);
      } else {
        x.set(newX);
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [running, duration, direction, loopWidth, useCSSFallback]);

  // -------- Pause/resume on hover --------
  const handleMouseEnter = () => pauseOnHover && setRunning(false);
  const handleMouseLeave = () => pauseOnHover && setRunning(true);

  // -------- Arrows --------
  const handleArrow = (dir) => {
    if (!trackRef.current) return;
    const nudge = loopWidth * 0.1;
    x.set(x.get() + (dir === "right" ? -nudge : nudge));
    setDirection(dir);
    setDuration(burstDuration);
    setTimeout(() => setDuration(baseDuration), 2000);
  };

  return (
    <section className="mb-8">
      <div className="bg-neutral-950/90 border-y-2 border-neutral-800 shadow-[0_0_20px_rgba(0,0,0,0.6)] rounded-lg overflow-hidden">
        <div className="px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          <h2 className="text-sm font-semibold text-neutral-200 tracking-wide uppercase">
            Local Mugshots
          </h2>
        </div>

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
            {useCSSFallback ? (
              <div className="flex gap-3 animate-marquee will-change-transform">
                {looped.map((it, idx) => (
                  <Card it={it} key={idx} />
                ))}
              </div>
            ) : (
              <motion.div
                ref={trackRef}
                className="flex gap-3 will-change-transform"
                style={{
                  x,
                  transform: "translate3d(0,0,0)",
                }}
              >
                {looped.map((it, idx) => (
                  <Card it={it} key={idx} />
                ))}
              </motion.div>
            )}
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

// ---- small pure card component ----
function Card({ it }) {
  return (
    <div className="min-w-[160px] bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden">
      <img
        src={it.public_url}
        alt={it.name}
        className="w-full h-32 object-cover transition-transform duration-500 hover:scale-105 hover:brightness-110"
      />
      <div className="p-1 text-center">
        <p className="text-xs font-medium text-neutral-200">{it.name}</p>
        {it.stats && <p className="text-[11px] text-neutral-400">{it.stats}</p>}
        {it.charges && (
          <p className="text-[10px] text-red-400 line-clamp-2">{it.charges}</p>
        )}
      </div>
    </div>
  );
}
