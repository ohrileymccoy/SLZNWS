// src/components/SectionRail.jsx
import { SECTION_ORDER, SECTION_LABELS } from "../constants/sections";

export default function SectionRail() {
  return (
    <div className="mt-6 flex gap-4 overflow-x-auto text-sm text-neutral-300">
      {SECTION_ORDER.map((key) => (
        <span
          key={key}
          className="rounded-full border border-white/10 px-3 py-1"
        >
          {SECTION_LABELS[key]}
        </span>
      ))}
    </div>
  );
}
