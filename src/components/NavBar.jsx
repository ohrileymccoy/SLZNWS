import { Link } from "react-router-dom";
import SubmitButtons from "./SubmitButtons";
import { SECTION_LABELS, SECTION_ORDER } from "./constants/sections"; 

export default function NavBar() {
  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      {/* Top row (brand + desktop nav) */}
      <div className="flex items-center justify-between px-3 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap"
        >
          Sleazy News (Beckley)
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-4 text-sm text-neutral-300">
          {SECTION_ORDER.map((key) => (
            <Link
              key={key}
              to={key === "news" ? "/" : `/section/${key}`}
              className="hover:text-white"
            >
              {SECTION_LABELS[key]}
            </Link>
          ))}

          {/* Shared submit buttons */}
          <SubmitButtons />
        </div>
      </div>

      {/* Mobile nav */}
      <div className="flex justify-center gap-2 py-2 border-t border-neutral-800 text-xs md:hidden">
        {SECTION_ORDER.map((key) => (
          <Link
            key={key}
            to={key === "news" ? "/" : `/section/${key}`}
            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
          >
            {SECTION_LABELS[key]}
          </Link>
        ))}

        {/* Shared submit buttons */}
        <SubmitButtons />
      </div>
    </nav>
  );
}
