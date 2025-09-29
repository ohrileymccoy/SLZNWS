// src/components/AdCard.jsx
import AdBanner from "./AdBanner";

export default function AdCard() {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors overflow-hidden">
      {/* Ad media area (16:9 like videos) */}
      <div style={{ aspectRatio: "16/9" }} className="w-full bg-neutral-800 flex items-center justify-center">
        <AdBanner />
      </div>

      {/* Text footer area to keep consistent spacing */}
      <div className="p-3">
        <div className="uppercase tracking-widest text-[10px] text-neutral-400 mb-1">
          Advertisement
        </div>
        <p className="text-xs text-neutral-500">Sponsored content</p>
      </div>
    </div>
  );
}
