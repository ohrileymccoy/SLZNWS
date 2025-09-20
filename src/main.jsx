// src/main.jsx
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
import PhotoPage from "./pages/PhotoPage.jsx";
import { SECTION_LABELS, SECTION_ORDER } from "./constants/sections"; // ✅ single source of truth

const brand = {
  primary: "#0430FC",
  accent: "#DCFC04",
};

function clsx(...xs) {
  return xs.filter(Boolean).join(" ");
}

// ------------------ App Shell ------------------

function AppShell() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
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
          <Route path="/submit" element={<Submit />} />
          <Route path="/submit-photo" element={<SubmitPhoto />} />
          <Route path="/photo/:id" element={<PhotoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// ------------------ Header ------------------

export function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-950/70 border-b border-neutral-800">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo + Title */}
        <Link to="/" className="group flex items-center gap-2 shrink-0 h-full">
          <img src={slnLogo} alt="Sleazy News Logo" className="h-full w-auto object-contain" />
          <span className="font-semibold tracking-wide text-lg transition-colors">
            <span className="group-hover:text-blue-400">S.</span>
            <span className="text-neutral-400 group-hover:text-blue-400">L.N</span>
          </span>
        </Link>

        {/* Center: Nav (desktop) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-2">
          <NavLink to="/" label="Home" active={isActive("/")} />
          {SECTION_ORDER.map((key) => (
            <NavLink
              key={key}
              to={key === "featured" ? "/featured" : `/section/${key}`}
              label={SECTION_LABELS[key]}
              active={
                key === "featured"
                  ? isActive("/featured")
                  : isActive(`/section/${key}`)
              }
            />
          ))}
        </nav>

        {/* Right: mobile toggle + submit */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded bg-neutral-800 hover:bg-neutral-700"
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <SubmitButtons />
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-neutral-950 border-t border-neutral-800" ref={dropdownRef}>
          <nav className="flex flex-col px-4 py-3 space-y-2">
            <NavLink to="/" label="Home" active={isActive("/")} />
            {SECTION_ORDER.map((key) => (
              <NavLink
                key={key}
                to={key === "featured" ? "/featured" : `/section/${key}`}
                label={SECTION_LABELS[key]}
                active={
                  key === "featured"
                    ? isActive("/featured")
                    : isActive(`/section/${key}`)
                }
              />
            ))}
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
      className={`px-3 py-1.5 rounded-xl text-sm transition-colors border ${
        active
          ? "bg-neutral-800/80 border-neutral-700"
          : "bg-neutral-900/40 border-transparent hover:border-neutral-700"
      }`}
    >
      {label}
    </Link>
  );
}

// ------------------ Footer ------------------

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
  const valid = SECTION_ORDER.includes(sectionKey);

  if (!valid) return <NotFound message="Unknown section." />;

  return (
    <div className="py-8">
      <PageTitle title={SECTION_LABELS[sectionKey]} eyebrow="Section" />
      <Feed section={sectionKey} />
    </div>
  );
}

function FeaturedPage() {
  return (
    <div className="py-8">
      <PageTitle title={SECTION_LABELS.featured} eyebrow="Curated" />
      <Feed section="featured" />
    </div>
  );
}

function NotFound({ message = "We couldn't find that." }) {
  return (
    <div className="py-24 text-center">
      <h2 className="text-xl font-semibold mb-2">404 — Not Found</h2>
      <p className="text-neutral-400 mb-6">{message}</p>
      <Link to="/" className="px-4 py-2 rounded-xl bg-neutral-800 border border-neutral-700">
        Back to Home
      </Link>
    </div>
  );
}

// ------------------ Modules ------------------

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
      value: stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleTimeString() : "—",
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
    const speed = 0.5;
    function tick() {
      if (!el) return;
      el.scrollLeft += speed;
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
        <h2 className="relative text-lg font-semibold text-neutral-100 pb-1 transition-all duration-300">
          <span className="relative z-10 group-hover:text-white">Local Mugshots</span>
          <span className="absolute inset-0 rounded-lg bg-neutral-800/80 shadow-lg opacity-0 scale-90 
                           group-hover:opacity-100 group-hover:scale-100 transition-all duration-300"></span>
        </h2>
      </div>
      <div ref={scrollRef} className="flex overflow-x-hidden gap-3 pb-2 snap-none" style={{ scrollBehavior: "auto" }}>
        {Array.from({ length: 10 }).map((_, repeatIdx) =>
          items.map((it, idx) => (
            <div
              key={`${repeatIdx}-${idx}`}
              className="min-w-[160px] bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden"
            >
              <img src={it.public_url} alt={it.name} className="w-full h-40 object-cover" />
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

function SectionTabs() {
  const location = useLocation();
  const tabs = [{ key: "all", label: "All", to: "/" }, ...SECTION_ORDER.filter((k) => k !== "featured")];

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {tabs.map((t) => (
        <Link
          key={t.key || t}
          to={t.to || `/section/${t}`}
          className={clsx(
            "px-3 py-1.5 rounded-2xl border text-sm",
            location.pathname === (t.to || `/section/${t}`)
              ? "border-neutral-700 bg-neutral-900/60"
              : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700"
          )}
        >
          {t.label || SECTION_LABELS[t]}
        </Link>
      ))}
    </div>
  );
}

function PageTitle({ title, eyebrow, compact }) {
  return (
    <div className={clsx("mb-4", compact && "mb-2")}>
      {eyebrow && <div className="uppercase tracking-widest text-[10px] text-neutral-400">{eyebrow}</div>}
      <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
    </div>
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
