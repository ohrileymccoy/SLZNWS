// src/components/AdBanner.jsx
import { useEffect } from "react";

export function AdBanner() {
  useEffect(() => {
    try {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
      }
    } catch (err) {
      console.error("Adsense error:", err);
    }
  }, []);

  return (
    <div className="my-6">
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-2 shadow-md overflow-hidden">
        <ins
          className="adsbygoogle block w-full h-32"
          style={{ display: "block" }}
          data-ad-client="ca-pub-7984767809375182"   // ✅ replace with your client ID
          data-ad-slot="1234567890"                  // ✅ replace with actual slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      </div>
    </div>
  );
}
