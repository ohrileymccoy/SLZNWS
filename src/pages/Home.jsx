import Hero from "../components/Hero.jsx";
import SectionRail from "../components/SectionRail.jsx";
import ArticleCard from "../components/ArticleCard.jsx";

export default function Home() {
  return (
    <div className="space-y-6">
      <Hero />
      <SectionRail />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ArticleCard key={idx} i={idx + 1} />
        ))}
      </div>
      <div id="sentinel" className="h-10 opacity-40 text-xs flex items-center justify-center border border-dashed border-white/10 rounded-xl">
        sentinel
      </div>
    </div>
  );
}
