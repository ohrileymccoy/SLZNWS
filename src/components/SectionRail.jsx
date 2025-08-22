export default function SectionRail() {
  return (
    <div className="mt-6 flex gap-4 overflow-x-auto text-sm text-neutral-300">
      {["News","Culture","Sports","Featured"].map(s => (
        <span key={s} className="rounded-full border border-white/10 px-3 py-1">{s}</span>
      ))}
    </div>
  );
}
