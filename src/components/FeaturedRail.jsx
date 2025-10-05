// src/components/FeaturedRail.jsx
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue } from "framer-motion";
import { createPortal } from "react-dom";

export default function FeaturedRail({
  baseDuration = 25,
  burstDuration = 8,
  pauseOnHover = true,
}) {
  const [items, setItems] = useState([]);
  const [loopWidth, setLoopWidth] = useState(0);
  const [useCSSFallback, setUseCSSFallback] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [activeArrow, setActiveArrow] = useState(null);

  const x = useMotionValue(0);
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const cardWidthRef = useRef(160);

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
      if (firstCard) cardWidthRef.current = firstCard.offsetWidth + 12;
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

      // ✅ 25% slower scroll speed
      const speed = (loopWidth / (duration * 60)) * 0.75;
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

  // -------- Pause/resume for desktop hover --------
  const handleMouseEnter = () => pauseOnHover && setRunning(false);
  const handleMouseLeave = () => pauseOnHover && setRunning(true);

  // -------- Mobile touch/tap handling --------
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    if (!("ontouchstart" in window)) return; // skip on desktop

    let touchStartY = 0;
    let touchStartX = 0;
    let moved = false;

    const handleTouchStart = (e) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      moved = false;
      setRunning(false);
    };

    const handleTouchMove = (e) => {
      const t = e.touches[0];
      if (
        Math.abs(t.clientX - touchStartX) > 10 ||
        Math.abs(t.clientY - touchStartY) > 10
      ) {
        moved = true;
      }
    };

    const handleTouchEnd = (e) => {
      if (!moved) {
        const target = e.target.closest(".mug-card");
        if (target) target.click();
      }
      setRunning(true);
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: true });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  // -------- Arrow buttons --------
  const handleArrow = (dir) => {
    if (!trackRef.current || !cardWidthRef.current) return;

    setRunning(false);
    setActiveArrow(dir);

    const distance = cardWidthRef.current * (dir === "right" ? -1 : 1);
    const current = x.get();
    const target = current + distance;
    const stepCount = 20;
    let step = 0;

    const animateStep = () => {
      step++;
      const progress = step / stepCount;
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = current + (target - current) * eased;
      x.set(value);
      if (step < stepCount) requestAnimationFrame(animateStep);
    };
    requestAnimationFrame(animateStep);

    setTimeout(() => setActiveArrow(null), 300);
    setRunning((prev) => !prev);
  };

  // -------- Card click --------
  const handleCardClick = (idx) => {
    if (selectedIdx !== null && selectedIdx !== idx) {
      setSelectedIdx(idx);
      return;
    }
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

        {/* Carousel */}
        <div className="relative flex items-center h-44 overflow-hidden">
          {/* Left arrow */}
          <button
            onClick={() => handleArrow("left")}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 text-white text-2xl rounded-full px-2 py-1 transition-all duration-300
            ${activeArrow === "left"
              ? "bg-cyan-500/30 shadow-[0_0_20px_#0ff]"
              : "bg-neutral-900/80 hover:bg-neutral-800"}`}
          >
            ‹
          </button>

          {/* Track */}
          <div
            className={`overflow-hidden flex-1 relative transition-all duration-300 ${
              selectedIdx !== null ? "brightness-[0.3]" : "brightness-100"
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {useCSSFallback ? (
              <div className="flex gap-3 animate-marquee will-change-transform">
                {looped.map((it, idx) => (
                  <Card
                    key={idx}
                    it={it}
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
                    key={idx}
                    it={it}
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
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 text-white text-2xl rounded-full px-2 py-1 transition-all duration-300
            ${activeArrow === "right"
              ? "bg-cyan-500/30 shadow-[0_0_20px_#0ff]"
              : "bg-neutral-900/80 hover:bg-neutral-800"}`}
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
  useEffect(() => {
    if (active) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [active]);

  const card = (
    <div
      onClick={onClick}
      className={`mug-card relative min-w-[160px] border border-neutral-800 rounded-2xl bg-neutral-900/60 
      transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
      ${active ? "z-[60] brightness-125" : "hover:cursor-pointer hover:scale-105"}`}
    >
      <img
        src={it.public_url}
        alt={it.name}
        className="w-full h-32 object-cover select-none rounded-t-2xl"
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

  const popup =
    active &&
    createPortal(
      <div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClick}
      >
        <div className="relative w-[90vw] max-w-md bg-neutral-950 border border-cyan-500 rounded-3xl shadow-[0_0_60px_rgba(0,255,255,0.5)] overflow-hidden animate-popcard">
          <img src={it.public_url} alt={it.name} className="w-full h-64 object-cover" />
          <div className="p-4 text-center">
            <h3 className="text-lg font-semibold text-cyan-400 mb-1">{it.name}</h3>
            {it.stats && <p className="text-sm text-neutral-300 mb-1">{it.stats}</p>}
            {it.charges && <p className="text-sm text-red-400 mb-2">{it.charges}</p>}
            <p className="text-xs text-neutral-500">(Tap or click anywhere to close)</p>
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      {card}
      {popup}
    </>
  );
}
