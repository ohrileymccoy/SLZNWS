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
  const [selectedIdx, setSelectedIdx] = useState(null);

  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const cardWidthRef = useRef(160); // fallback

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
      const width = trackRef.current.scrollWidth / 2;
      setLoopWidth(width);
      const firstCard = trackRef.current.querySelector(".mug-card");
      if (firstCard) cardWidthRef.current = firstCard.offsetWidth + 12; // include gap
    });
    return () => cancelAnimationFrame(raf);
  }, [items]);

  // -------- Safari detection --------
  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/safari/.test(ua) && !/chrome/.test(ua)) {
      if (!window.requestAnimationFrame) setUseCSSFallback(true);
    }
  }, []);

  // -------- RAF ticker loop --------
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

      const speed = loopWidth / (duration * 60);
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

  // -------- Pause on hover (desktop only) --------
  const handleMouseEnter = () => pauseOnHover && setRunning(false);
  const handleMouseLeave = () => pauseOnHover && setRunning(true);

  // -------- Arrow buttons --------
const handleArrow = (dir) => {
  if (!trackRef.current || !cardWidthRef.current) return;

  setRunning(false); // pause scrolling when user interacts

  const distance = cardWidthRef.current * (dir === "right" ? -1 : 1);

  // Smoothly animate to next card
  const current = x.get();
  const target = current + distance;
  const stepCount = 20;
  let step = 0;

  const animateStep = () => {
    step++;
    const progress = step / stepCount;
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const value = current + (target - current) * eased;
    x.set(value);
    if (step < stepCount) requestAnimationFrame(animateStep);
  };
  requestAnimationFrame(animateStep);

  // toggle resume only if user clicks again
  if (running) setRunning(false);
  else setRunning(true);
};

// -------- Card click --------
const handleCardClick = (idx) => {
  // toggle pause/resume on card click
  if (running) {
    setRunning(false);
    setSelectedIdx(idx);
  } else {
    setRunning(true);
    setSelectedIdx(null);
  }
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

          {/* Scrolling track */}
          <div
            className="overflow-hidden flex-1"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {useCSSFallback ? (
              <div className="flex gap-3 animate-marquee will-change-transform">
                {looped.map((it, idx) => (
                  <Card
                    it={it}
                    key={idx}
                    active={idx === selectedIdx}
                    onClick={() => handleCardClick(idx)}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                ref={trackRef}
                className="flex gap-3 will-change-transform"
                style={{ x, transform: "translate3d(0,0,0)" }}
              >
                {looped.map((it, idx) => (
                  <Card
                    it={it}
                    key={idx}
                    active={idx === selectedIdx}
                    onClick={() => handleCardClick(idx)}
                  />
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

// ---- Card ----
function Card({ it, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`mug-card min-w-[160px] border border-neutral-800 rounded-2xl overflow-hidden 
      bg-neutral-900/60 transition-all duration-300 ${
        active
          ? "shadow-[0_0_20px_#0ff] scale-105 brightness-110"
          : "hover:cursor-pointer"
      }`}
    >
      <img
        src={it.public_url}
        alt={it.name}
        className="w-full h-32 object-cover"
        draggable={false}
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
