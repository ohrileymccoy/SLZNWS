// src/components/AdBanner.jsx
import { useEffect, useState } from "react";

export function AdBanner() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect width and update on resize
    const check = () => setIsMobile(window.innerWidth < 640);
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
  }, [isMobile]); // re-trigger when slot type changes

  return (
    <section className="relative w-full my-6 sm:my-10">
      {/* ✨ shimmer motion */}
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" />
      </div>

      {/* glow frame */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-30 blur-md rounded-xl" />

      {/* ad container */}
      <div className="relative w-full overflow-hidden rounded-xl border border-neutral-700 bg-neutral-950/80 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
        {isMobile ? (
          // 📱 mobile compact vertical ad
          <ins
            className="adsbygoogle block w-full h-[250px]" // typical 300x250 responsive height
            style={{ display: "block" }}
            data-ad-client="ca-pub-7984767809375182"
            data-ad-slot="1234567890"  // ⚠️ replace with your mobile slot ID
            data-ad-format="rectangle"
            data-ad-layout="in-article"
            data-full-width-responsive="true"
          />
        ) : (
          // 🖥️ desktop/tablet shimmer horizontal banner
          <ins
            className="adsbygoogle block w-full h-[70px] sm:h-[90px] md:h-[120px]"
            style={{ display: "block" }}
            data-ad-client="ca-pub-7984767809375182"
            data-ad-slot="9876543210"  // ⚠️ replace with your desktop slot ID
            data-ad-format="horizontal"
            data-ad-layout="in-article"
            data-full-width-responsive="true"
          />
        )}
      </div>
    </section>
  );
}
