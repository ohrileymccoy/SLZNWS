import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SubmitButtons from "./SubmitButtons";
import { SECTION_LABELS, SECTION_ORDER } from "./constants/sections";

export default function NavBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery("");
    }
  }

  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      {/* Top row (brand + desktop nav + search) */}
      <div className="flex items-center justify-between px-3 h-16">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap"
        >
          Sleazy News (Beckley)
        </Link>

        {/* Desktop nav + search */}
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

          {/* Search form */}
          <form onSubmit={handleSearch} className="ml-4 flex items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              className="rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm outline-none focus:border-neutral-500"
            />
          </form>
        </div>
      </div>

      {/* Mobile nav + search */}
      <div className="flex flex-col items-center gap-2 py-2 border-t border-neutral-800 text-xs md:hidden">
        <div className="flex flex-wrap justify-center gap-2">
          {SECTION_ORDER.map((key) => (
            <Link
              key={key}
              to={key === "news" ? "/" : `/section/${key}`}
              className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
            >
              {SECTION_LABELS[key]}
            </Link>
          ))}
          <SubmitButtons />
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="w-full px-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="w-full rounded bg-neutral-900 border border-neutral-700 px-2 py-1 text-sm outline-none focus:border-neutral-500"
          />
        </form>
      </div>
    </nav>
  );
}
