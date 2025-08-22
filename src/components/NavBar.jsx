import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="flex items-center justify-between py-3">
      <Link to="/" className="text-lg font-semibold tracking-tight">
        Oak Hill News
      </Link>
      <div className="flex items-center gap-6 text-sm text-neutral-300">
        <Link to="/" className="hover:text-white">News</Link>
        <span className="cursor-not-allowed opacity-50" title="Coming soon">Culture</span>
        <span className="cursor-not-allowed opacity-50" title="Coming soon">Sports</span>
      </div>
    </nav>
  );
}
