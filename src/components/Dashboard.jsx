// src/components/Dashboard.jsx
import { useMemo } from "react";

// -----------------------------
// Small KPI chip component
// -----------------------------
function KpiChip({ label, value, loading }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      {/* Label above the number */}
      <div className="text-xs text-neutral-400">{label}</div>
      {/* Value shown large, or em-dash if loading */}
      <div className="text-xl font-semibold">{loading ? "—" : value}</div>
    </div>
  );
}

// -----------------------------
// Horizontal rail of cards
// -----------------------------
function Rail({ title, items, emptyText = "Nothing yet" }) {
  return (
    <section className="mt-6">
      {/* Section header */}
      <div className="mb-2 text-sm text-neutral-300">{title}</div>

      {/* Scrollable rail: either real items or skeleton placeholders */}
      <div className="flex gap-3 overflow-x-auto pb-1">
        {(items?.length ? items : [null, null, null])
          .slice(0, 6) // limit to 6 visible
          .map((it, i) =>
            it ? (
              // Real article card
              <a
                key={it.id}
                href={`/article/${it.slug}`}
                className="min-w-[240px] rounded-xl border border-white/10 bg-white/5 p-3"
              >
                <div className="text-sm font-medium line-clamp-2">
                  {it.title}
                </div>
                {it.dek && (
                  <div className="mt-1 text-xs text-neutral-400 line-clamp-2">
                    {it.dek}
                  </div>
                )}
              </a>
            ) : (
              // Skeleton placeholder card
              <div
                key={i}
                className="min-w-[240px] rounded-xl border border-white/10 bg-white/5 p-3 animate-pulse"
              >
                <div className="h-4 w-4/5 bg-white/10 rounded mb-2" />
                <div className="h-3 w-3/4 bg-white/10 rounded" />
              </div>
            )
          )}
      </div>

      {/* Empty rail label when nothing at all */}
      {!items?.length && (
        <div className="mt-2 text-xs text-neutral-500">{emptyText}</div>
      )}
    </section>
  );
}

// -----------------------------
// Dashboard (top of home page)
// -----------------------------
export default function Dashboard({ pageOneItems, loading }) {
  // useMemo: calculate KPIs and rails once per pageOneItems change
  const { newToday, sectionsCount, lastUpdated, featured, bySection } =
    useMemo(() => {
      const result = {
        newToday: 0,
        sectionsCount: 0,
        lastUpdated: null,
        featured: [],
        bySection: { news: [], culture: [], sports: [] },
      };

      // No items case: return early
      if (!pageOneItems?.length) return result;

      const today = new Date().toDateString();
      for (const it of pageOneItems) {
        // Count how many were created today
        if (new Date(it.created_at).toDateString() === today) result.newToday++;

        // Collect featured stories
        if (it.is_featured) result.featured.push(it);

        // Group by section (news/culture/sports)
        if (it.section && result.bySection[it.section]) {
          result.bySection[it.section].push(it);
        }
      }

      // Count how many unique sections appear
      result.sectionsCount = new Set(pageOneItems.map((i) => i.section)).size;

      // Last updated = timestamp of first article
      result.lastUpdated = pageOneItems[0]?.created_at || null;

      // Cap featured to 3 items
      result.featured = result.featured.slice(0, 3);

      return result;
    }, [pageOneItems]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4">
      {/* ---------------- KPI Band ---------------- */}
      <div className="grid grid-cols-3 gap-3">
        <KpiChip label="New Today" value={newToday} loading={loading} />
        <KpiChip label="Sections Present" value={sectionsCount} loading={loading} />
        <KpiChip
          label="Last Updated"
          value={lastUpdated ? new Date(lastUpdated).toLocaleString() : "—"}
          loading={loading}
        />
      </div>

      {/* ---------------- Featured Rail ---------------- */}
      <Rail title="Featured" items={featured} emptyText="No featured stories yet" />

      {/* ---------------- Section Rails ---------------- */}
      <Rail title="News" items={bySection.news} />
      <Rail title="Culture" items={bySection.culture} />
      <Rail title="Sports" items={bySection.sports} />
    </div>
  );
}