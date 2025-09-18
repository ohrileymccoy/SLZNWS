import { Link } from "react-router-dom";
import SubmitButtons from "./SubmitButtons";

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

        {/* Desktop nav + buttons (hidden on <768px) */}
        <div className="hidden md:flex items-center gap-4 text-sm text-neutral-300">
          <Link to="/" className="hover:text-white">
            News
          </Link>
          <span className="cursor-not-allowed opacity-50" title="Coming soon">
            Culture
          </span>
          <span className="cursor-not-allowed opacity-50" title="Coming soon">
            Sports
          </span>

          {/* Shared submit buttons */}
          <SubmitButtons />
        </div>
      </div>

      {/* Mobile nav bar (hidden on ≥768px) */}
      <div className="flex justify-center gap-2 py-2 border-t border-neutral-800 text-xs md:hidden">
        <Link
          to="/"
          className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
        >
          News
        </Link>
        <span
          className="px-2 py-1 rounded bg-neutral-800/60 text-neutral-500 cursor-not-allowed"
          title="Coming soon"
        >
          Culture
        </span>
        <span
          className="px-2 py-1 rounded bg-neutral-800/60 text-neutral-500 cursor-not-allowed"
          title="Coming soon"
        >
          Sports
        </span>

        {/* Shared submit buttons (mobile) */}
        <SubmitButtons />
      </div>
    </nav>
  );
}
