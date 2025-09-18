import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import "./index.css";
import SecureAdmin from "./components/SecureAdmin.jsx";
import Feed from "./components/Feed.jsx";
import Submit from "./pages/Submit.jsx";
import slnLogo from "./assets/preview.png";
import ArticlePage from "./pages/ArticlePage.jsx";
import MugshotPage from "./pages/MugshotPage.jsx";
import TOSModal from "./components/TOSModal";
import SubmitPhoto from "./pages/SubmitPhoto.jsx";
import SubmitButtons from "./components/SubmitButtons";

/**
 * SLN — Routing + UX Shell (Phase 6–7, JS version)
 * - Routes: /, /section/:section, /featured, /article/:slug
 * - Dark, sharp, floating-card UI using Tailwind
 * - Sentinel demo for infinite scroll (mocked)
 */

const brand = {
  primary: "#0430FC",
  accent: "#DCFC04",
};

const SECTIONS = ["news", "culture", "sports"];

function clsx(...xs) {
  return xs.filter(Boolean).join(" ");
}

function AppShell() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* 🔹 Terms of Service modal overlays the whole app */}
      <TOSModal />

      <Header />
      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-24">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/SSHadmin" element={<SecureAdmin />} />
          <Route path="/mugshot" element={<MugshotPage />} />
          <Route path="/section/:section" element={<SectionPage />} />
          <Route path="/featured" element={<FeaturedPage />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/submit" element={<Submit />} />
          <Route path="/submit-photo" element={<SubmitPhoto />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


function Header() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
  {/* Left: Logo + Title */}
<Link to="/" className="group flex items-center gap-2 shrink-0 h-full">
  <img
    src={slnLogo}
    alt="Sleazy News Logo"
    className="h-full w-auto object-contain" // fills navbar height
  />
  <span className="font-semibold tracking-wide text-lg transition-colors">
    <span className="group-hover:text-blue-400 transition-colors">S.</span>
    <span className="text-neutral-400 group-hover:text-blue-400 transition-colors">
      L.N
    </span>
  </span>
</Link>

        {/* Center: Pills (desktop only) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
          <NavLink to="/" label="Home" active={isActive("/")} />
          <NavLink to="/section/news" label="News" active={isActive("/section/news")} />
          <NavLink to="/section/culture" label="Culture" active={isActive("/section/culture")} />
          <NavLink to="/section/sports" label="Sports" active={isActive("/section/sports")} />
          <NavLink to="/featured" label="Featured" active={isActive("/featured")} />
        </nav>

     {/* Right cluster: Hamburger (mobile only) + Submit buttons */}
<div className="flex items-center gap-2">
  {/* Hamburger only on mobile */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden p-2 rounded bg-neutral-800 hover:bg-neutral-700"
    aria-label="Toggle menu"
  >
    {/* 3-line icon */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>

  {/* Shared submit buttons */}
  <SubmitButtons />
</div>
</div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-950 border-t border-neutral-800">
          <nav className="flex flex-col px-4 py-3 space-y-2">
            <NavLink to="/" label="Home" active={isActive("/")} />
            <NavLink to="/section/news" label="News" active={isActive("/section/news")} />
            <NavLink to="/section/culture" label="Culture" active={isActive("/section/culture")} />
            <NavLink to="/section/sports" label="Sports" active={isActive("/section/sports")} />
            <NavLink to="/featured" label="Featured" active={isActive("/featured")} />
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={`px-3 py-1.5 rounded-xl text-sm transition-colors border 
        ${active
          ? "bg-neutral-800/80 border-neutral-700"
          : "bg-neutral-900/40 border-transparent hover:border-neutral-700"}`}
    >
      {label}
    </Link>
  );
}


function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-neutral-400 flex items-center justify-between">
        <p>© {new Date().getFullYear()} Sleazy News Beckley</p>
        <p>
          <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: brand.accent }} />
          Half-news, half-satire.
        </p>
      </div>
    </footer>
  );
}

// ------------------ Pages ------------------

function HomePage() {
  const navigate = useNavigate();
  return (
    <div className="py-8">
      <KPIBand />
      <FeaturedRail onOpen={(slug) => navigate(`/article/${slug}`)} />
      <SectionTabs />
     <Feed />

    </div>
  );
}

function SectionPage() {
  const { section } = useParams();
  const sectionKey = (section || "").toLowerCase();
  const valid = SECTIONS.includes(sectionKey);

  if (!valid) return <NotFound message="Unknown section." />;

  const title = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
  return (
    <div className="py-8">
      <PageTitle title={title} eyebrow="Section" />
      <Feed section={sectionKey} />

    </div>
  );
}

function FeaturedPage() {
  return (
    <div className="py-8">
      <PageTitle title="Featured" eyebrow="Curated" />
     <Feed section="featured" />
    </div>
  );
}




function NotFound({ message = "We couldn't find that." }) {
  return (
    <div className="py-24 text-center">
      <h2 className="text-xl font-semibold mb-2">404 — Not Found</h2>
      <p className="text-neutral-400 mb-6">{message}</p>
      <Link to="/" className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700">Back to Home</Link>
    </div>
  );
}

// -------------- Modules / Rails --------------

function KPIBand() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/v1/videos/stats");
        const json = await res.json();
        if (json.ok) setStats(json.stats);
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    loadStats();
  }, []);

  if (!stats) return null;

  const data = [
    { label: "New today", value: stats.newToday },
    { label: "Total videos", value: stats.total },
    {
      label: "Last updated",
      value: stats.lastUpdated
        ? new Date(stats.lastUpdated).toLocaleTimeString()
        : "—",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
      {data.map((k) => (
        <div
          key={k.label}
          className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-4 flex items-center justify-between 
                     transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="text-neutral-400 text-sm">{k.label}</span>
          <span className="text-lg font-semibold">{k.value}</span>
        </div>
      ))}
    </div>
  );
}


function FeaturedRail() {
  const scrollRef = useRef(null);
  const [items, setItems] = useState([]);

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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let frame;
    const speed = 0.5; // pixels per frame
    function tick() {
      if (!el) return;

      el.scrollLeft += speed;

      // when we near the end of the list, jump back halfway
      // so it looks continuous without snapping
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.scrollLeft = 0;
      }

      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [items]);

  return (
    <section className="mb-8">
    <div className="flex items-center justify-between mb-3 relative group">
  <h2
    className="relative text-lg font-semibold text-neutral-100 border-b-2 border-transparent pb-1 
               group-hover:border-neutral-500 transition-all duration-300"
  >
    <span
      className="relative z-10 group-hover:text-white transition-colors duration-300"
    >
      Local Mugshots
    </span>

    {/* grey bubble background */}
    <span
      className="absolute inset-0 rounded-lg bg-neutral-800/80 shadow-lg opacity-0 scale-90 
                 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"
    ></span>
  </h2>
</div>
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden gap-3 pb-2 snap-none"
        style={{ scrollBehavior: "auto" }} // disable smooth snap
      >
        {/* repeat list 10x so it feels endless */}
        {Array.from({ length: 10 }).map((_, repeatIdx) =>
          items.map((it, idx) => (
            <div
              key={`${repeatIdx}-${idx}`}
              className="min-w-[160px] bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              <img
                src={it.public_url}
                alt={it.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-neutral-300">{it.name}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}


export default FeaturedRail;

function SectionTabs() {
  const location = useLocation();
  const tabs = [
    { label: "All", to: "/" },
    { label: "News", to: "/section/news" },
    { label: "Culture", to: "/section/culture" },
    { label: "Sports", to: "/section/sports" },
  ];
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((t) => (
        <Link
          key={t.to}
          to={t.to}
          className={clsx(
            "px-3 py-1.5 rounded-2xl border text-sm",
            location.pathname === t.to
              ? "border-neutral-700 bg-neutral-900/60"
              : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700"
          )}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

// -------------- Feed Scaffold (Phase 7 shell) --------------

function FeedScaffold({ title, subtitle, section, featuredOnly }) {
  const [items, setItems] = useState(() => Array.from({ length: 6 }, (_, i) => i));
  const [isFetching, setIsFetching] = useState(false);
  const [endOfList, setEndOfList] = useState(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!sentinelRef.current || endOfList) return;
    const el = sentinelRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isFetching) {
          setIsFetching(true);
          setTimeout(() => {
            setItems((prev) => {
              if (prev.length >= 24) {
                setEndOfList(true);
                return prev;
              }
              const more = Array.from({ length: 6 }, (_, i) => prev.length + i);
              return [...prev, ...more];
            });
            setIsFetching(false);
          }, 700);
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isFetching, endOfList]);

  return (
    <section className="mt-2">
      <PageTitle title={title} eyebrow={subtitle} />
      <div className="mb-3 text-xs text-neutral-400">
        {section && <span className="mr-3">Section: {section}</span>}
        {featuredOnly && <span>Filter: featured only</span>}
      </div>

      <ul className="grid gap-3">
        {items.map((i) => (
          <li key={i}>
            <ArticleCardSkeleton index={i} />
          </li>
        ))}
      </ul>

      {!endOfList && <div ref={sentinelRef} className="h-10" aria-hidden />}
      <div className="flex items-center justify-center py-6">
        {isFetching && <div className="text-sm text-neutral-400">Loading more…</div>}
        {endOfList && <div className="text-sm text-neutral-500">You’ve reached the end.</div>}
      </div>
    </section>
  );
}

function PageTitle({ title, eyebrow, compact }) {
  return (
    <div className={clsx("mb-4", compact && "mb-2")}>
      {eyebrow && (
        <div className="uppercase tracking-widest text-[10px] text-neutral-400">{eyebrow}</div>
      )}
      <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
    </div>
  );
}

function ArticleCardSkeleton({ index }) {
  return (
    <article className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 hover:border-neutral-700 transition-colors">
      <div className="aspect-[16/9] w-full rounded-xl bg-neutral-800 mb-3" />
      <div className="h-5 w-3/4 bg-neutral-800 rounded mb-2" />
      <div className="h-4 w-1/2 bg-neutral-800 rounded" />
      <div className="mt-3 text-[11px] text-neutral-500">Placeholder card #{index + 1}</div>
    </article>
  );
}

// ------------------ Mount ------------------

function Root() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </StrictMode>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<Root />);
}

// ------------------ Next Steps ------------------
// 1) npm i react-router-dom
// 2) Keep this as src/main.jsx (JS only). No TS syntax.
// 3) Ensure Tailwind is set up; classes assume dark-first.
// 4) Later, wire real fetches to /api/v1/articles and hydrate cards.
// 5) Add scroll restoration per Phase 6 (preserve items + position).

