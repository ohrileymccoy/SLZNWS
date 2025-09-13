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

          {/* New public upload link */}
          <Link
  to="/submit"
  className="flex items-center gap-1 rounded-[4px] bg-[#0430FC] hover:bg-[#0625a6] 
             text-white text-sm font-medium px-4 py-2 transition active:scale-95"
>
  Submit Video
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" 
       className="h-4 w-4 fill-current">
    <path d="M17 15V8H15V15H8V17H15V24H17V17H24V15H17Z" />
  </svg>
</Link>


          {/* Admin stays hidden from nav to avoid public exposure */}
          {/* <Link to="/admin" className="hover:text-white block">Admin</Link> */}
        </div>
      </div>
    </nav>
  );
}
