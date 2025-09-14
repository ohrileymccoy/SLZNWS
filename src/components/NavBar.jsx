import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="flex items-center justify-between px-3 py-3">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap"
        >
          Sleazy News (Beckley)
        </Link>

        {/* Desktop nav + button */}
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

          {/* Desktop Submit Video button */}
          <Link
            to="/submit"
            className="flex items-center gap-1 rounded-[4px] bg-[#0430FC] hover:bg-[#0625a6]
                       text-white text-sm font-medium px-3 py-1.5 transition active:scale-95"
          >
            Submit Video
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              className="h-4 w-4 fill-current"
            >
              <path d="M17 15V8H15V15H8V17H15V24H17V17H24V15H17Z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Mobile nav bar */}
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

        {/* 👇 Slimmed-down Mobile Submit button */}
        <Link
          to="/submit"
          className="flex items-center gap-1 rounded bg-[#0430FC] hover:bg-[#0625a6]
                     text-white text-[10px] font-medium px-2 py-1 transition active:scale-95"
        >
          Submit
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-3 w-3 fill-current"
          >
            <path d="M17 15V8H15V15H8V17H15V24H17V17H24V15H17Z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}
