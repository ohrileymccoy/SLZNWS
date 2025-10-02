// src/components/NavBar.jsx
import { Link } from "react-router-dom";
import SubmitButtons from "./SubmitButtons";
import { SECTION_LABELS, SECTION_ORDER } from "./constants/sections"; 

export default function NavBar() {
  return (
    <nav className="w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur">
      {/* Top row (brand + desktop nav) */}
      <div className="flex items-center justify-between px-3 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap text-[var(--color-heading)]"
        >
          Sleazy News (Beckley)
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 text-sm text-[var(--color-muted)]">
          {SECTION_ORDER.map((key) => (
            <Link
              key={key}
              to={key === "news" ? "/" : `/section/${key}`}
              className="hover:text-[var(--color-text)]"
            >
              {SECTION_LABELS[key]}
            </Link>
          ))}

          {/* Shared submit buttons */}
          <SubmitButtons />
        </div>
      </div>
    </nav>
  );
}
