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
import slnLogo from "./assets/preview2.png";
import ArticlePage from "./pages/ArticlePage.jsx";
import MugshotPage from "./pages/MugshotPage.jsx";
import TOSModal from "./components/TOSModal";
import SubmitPhoto from "./pages/SubmitPhoto.jsx";
import SubmitButtons from "./components/SubmitButtons";
import PhotoPage from "./pages/PhotoPage.jsx";
import { SECTION_LABELS, SECTION_ORDER } from "./constants/sections"; // ✅ single source of truth
import FeaturedRail from "./components/FeaturedRail"; // ✅ standalone component
import { AdBanner } from "./components/AdBanner";
import SearchPage from "./pages/SearchPage.jsx";


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
     <main className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 pb-24 overflow-x-hidden">

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

  {/* 🔎 New search route */}
  <Route path="/search" element={<SearchPage />} />

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

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setMenuOpen(false);
    }
  }

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);
return (
  <header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/80 border-b border-neutral-800">
    <div className="mx-auto w-full px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
      {/* Left: Logo */}
      <Link to="/" className="group flex items-center gap-1 sm:gap-2 shrink-0 h-full">
        <img
          src={slnLogo}
          alt="Sleazy News Logo"
          className="h-8 w-auto sm:h-10 object-contain"
        />
        <span className="font-semibold tracking-wide text-sm sm:text-lg transition-colors">
          <span className="group-hover:text-blue-400">S.</span>
          <span className="text-neutral-400 group-hover:text-blue-400">L.N</span>
        </span>
      </Link>

      {/* Center: search bar (mobile fits nicely) */}
      <form
        onSubmit={handleSearch}
        className="flex-1 px-2 sm:px-4 min-w-[100px]"
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="w-full h-8 sm:h-9 rounded-md bg-neutral-900 border border-neutral-700 px-2 sm:px-3 text-[13px] sm:text-sm outline-none focus:border-neutral-500"
        />
      </form>

      {/* Right: menu + buttons */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button
          ref={buttonRef}
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-1.5 sm:p-2 rounded bg-neutral-800 hover:bg-neutral-700"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden xs:flex sm:flex">
          <SubmitButtons />
        </div>
      </div>
    </div>

    {/* Mobile dropdown (unchanged except padding) */}
    {menuOpen && (
      <div ref={menuRef} className="md:hidden bg-neutral-950 border-t border-neutral-800">
        <nav className="flex flex-col px-3 py-3 space-y-2">
          <Link
            to="/"
            className="px-3 py-1.5 rounded-xl text-sm border border-neutral-700 bg-neutral-900/60"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {SECTION_ORDER.map((key) => (
            <Link
              key={key}
              to={key === 'featured' ? '/featured' : `/section/${key}`}
              className="px-3 py-1.5 rounded-xl text-sm border border-transparent hover:border-neutral-700 hover:bg-neutral-900/40"
              onClick={() => setMenuOpen(false)}
            >
              {SECTION_LABELS[key]}
            </Link>
          ))}

          <form onSubmit={handleSearch} className="mt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-sm outline-none focus:border-neutral-500"
            />
          </form>
        </nav>
      </div>
    )}
  </header>
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
    <div className="w-full min-h-screen py-8">
      <AdBanner /> {/* ✅ replaces KPIBand, same slot in layout */}
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
    <div className="w-full min-h-screen py-8">
      <PageTitle title={SECTION_LABELS[sectionKey]} eyebrow="Section" />
      <Feed section={sectionKey} />
    </div>
  );
}

function FeaturedPage() {
  return (
    <div className="w-full min-h-screen py-8">

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

