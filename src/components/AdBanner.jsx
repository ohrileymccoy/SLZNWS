// src/components/AdBanner.jsx
import { useEffect, useState } from "react";

export function AdBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
  }, [isMobile]);

  return (
    <section className="relative w-full my-6 sm:my-10">
      {/* shimmer */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" />
      </div>

      {/* glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30 blur-md rounded-xl" />

      {/* ad slot */}
      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950/80 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
        <ins
          className={`adsbygoogle block w-full ${
            isMobile
              ? "aspect-[6/1] h-auto min-h-[60px] max-h-[90px]" // 👈 slimmer mobile ratio
              : "h-[70px] sm:h-[90px] md:h-[120px]"
          }`}
          style={{ display: "block" }}
          data-ad-client="ca-pub-7984767809375182"
          data-ad-slot={isMobile ? "1234567890" : "9876543210"}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </section>
  );
}
