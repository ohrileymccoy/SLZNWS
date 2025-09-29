// src/components/AdBanner.jsx
import { useEffect } from "react";
export function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("Adsense error:", err);
    }
  }, []);

  return (
    <div className="relative my-8 rounded-2xl overflow-hidden">
      {/* Futuristic glowing frame */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-70 blur-lg"></div>
      <div className="relative bg-neutral-950/80 border border-neutral-700 rounded-2xl p-2 shadow-[0_0_25px_rgba(0,255,255,0.3)]">
        <ins
          className="adsbygoogle block w-full h-32"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7984767809375182"
          data-ad-slot="1234567890" // 🚨 Need real slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}