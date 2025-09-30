import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SubmitButtons from "./SubmitButtons";
import { SECTION_LABELS, SECTION_ORDER } from "./constants/sections";
import { useTheme } from "../ThemeProvider";

export default function NavBar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const { theme, setTheme } = useTheme();

  const isActive = (path) => location.pathname === path;

  // close menu on outside click
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
    <nav className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="flex items-center justify-between px-3 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap"
        >
          Sleazy News (Beckley)
        </Link>

        {/* Right controls: Theme toggle + Hamburger + Submit */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded bg-neutral-800 hover:bg-neutral-700"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌞" : "🌙"}
          </button>

          {/* Hamburger */}
          <button
            ref={buttonRef}
            onClick={() => setMenuOpen((o) => !o)}
            className="p-2 rounded bg-neutral-800 hover:bg-neutral-700"
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Shared submit buttons */}
          <SubmitButtons />
        </div>
      </div>

      {/* Hamburger drawer */}
      {menuOpen && (
        <div ref={menuRef} className="bg-neutral-950 border-t border-neutral-800">
          <nav className="flex flex-col px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-1.5 rounded-xl text-sm transition-colors border ${
                isActive("/") 
                  ? "bg-neutral-800/80 border-neutral-700"
                  : "bg-neutral-900/40 border-transparent hover:border-neutral-700"
              }`}
            >
              Home
            </Link>
            {SECTION_ORDER.map((key) => (
              <Link
                key={key}
                to={key === "news" ? "/" : `/section/${key}`}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-1.5 rounded-xl text-sm transition-colors border ${
                  isActive(key === "news" ? "/" : `/section/${key}`)
                    ? "bg-neutral-800/80 border-neutral-700"
                    : "bg-neutral-900/40 border-transparent hover:border-neutral-700"
                }`}
              >
                {SECTION_LABELS[key]}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </nav>
  );
}
