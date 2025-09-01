import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="w-full overflow-x-hidden px-2 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Brand */}
        <Link
          to="/"
          className="text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap"
        >
          Sleazy News (Beckley)
        </Link>

        {/* Menu */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-300">
          <Link to="/" className="hover:text-white block">
            News
          </Link>
          <span
            className="cursor-not-allowed opacity-50 block"
            title="Coming soon"
          >
            Culture
          </span>
          <span
            className="cursor-not-allowed opacity-50 block"
            title="Coming soon"
          >
            Sports
          </span>
        </div>
      </div>
    </nav>
  );
}
