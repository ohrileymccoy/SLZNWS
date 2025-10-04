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
import { createPortal } from "react-dom"; //

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
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
      setSearchOpen(false);
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
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 backdrop-blur bg-neutral-950/80 border-b border-neutral-800">
        <div className="mx-auto w-full px-3 sm:px-4 md:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          
          {/* Left: Logo */}
          <Link
            to="/"
            className="group flex items-center gap-1 sm:gap-2 shrink-0 h-full"
          >
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

          {/* Center: Search (desktop only) */}
          <form
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 px-2 sm:px-4 min-w-[100px]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="w-full h-8 sm:h-9 rounded-md bg-neutral-900 border border-neutral-700 px-2 sm:px-3 text-[13px] sm:text-sm outline-none focus:border-neutral-500"
            />
          </form>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden p-2 rounded bg-neutral-800 hover:bg-neutral-700"
              aria-label="Open search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Upload / Submit buttons always visible */}
            <div className="flex gap-1">
              <Link
                to="/submit-photo"
                className="px-2 sm:px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-xs sm:text-sm text-white font-semibold"
              >
                Upload Photo +
              </Link>
              <Link
                to="/submit"
                className="px-2 sm:px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm text-white font-semibold"
              >
                Submit Video +
              </Link>
            </div>

            {/* Hamburger menu */}
            <button
              ref={buttonRef}
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded bg-neutral-800 hover:bg-neutral-700"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            ref={menuRef}
            className="md:hidden bg-neutral-950 border-t border-neutral-800"
          >
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
                  to={key === "featured" ? "/featured" : `/section/${key}`}
                  className="px-3 py-1.5 rounded-xl text-sm border border-transparent hover:border-neutral-700 hover:bg-neutral-900/40"
                  onClick={() => setMenuOpen(false)}
                >
                  {SECTION_LABELS[key]}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ✅ Mobile Search Overlay (Portal) */}
      {searchOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setSearchOpen(false)}
          >
            <form
              onSubmit={handleSearch}
              className="relative bg-neutral-950 border border-neutral-700 rounded-xl p-4 w-[90%] max-w-sm shadow-[0_0_30px_rgba(0,255,255,0.2)] animate-[fadeIn_0.2s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Sleazy News…"
                className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-neutral-200 focus:border-cyan-400 outline-none"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>,
          document.body
        )}
    </>
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

