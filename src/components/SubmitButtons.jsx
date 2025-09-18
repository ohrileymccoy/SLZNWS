import { Link } from "react-router-dom";

export default function SubmitButtons() {
  return (
    <div className="flex items-center gap-2">
      <Link
        to="/submit-photo"
        className="flex-shrink-0 flex items-center gap-1 rounded-[4px] 
                   bg-red-600 hover:bg-red-700
                   text-white font-medium 
                   text-xs px-2 py-1
                   sm:text-sm sm:px-3 sm:py-1.5
                   transition active:scale-95"
      >
        Upload Photo
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
             className="h-3 w-3 fill-current sm:h-4 sm:w-4">
          <path d="M17 15V8H15V15H8V17H15V24H17V17H24V15H17Z" />
        </svg>
      </Link>

      <Link
        to="/submit"
        className="flex-shrink-0 flex items-center gap-1 rounded-[4px] 
                   bg-[#0430FC] hover:bg-[#0625a6]
                   text-white font-medium 
                   text-xs px-2 py-1
                   sm:text-sm sm:px-3 sm:py-1.5
                   transition active:scale-95"
      >
        Submit Video
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"
             className="h-3 w-3 fill-current sm:h-4 sm:w-4">
          <path d="M17 15V8H15V15H8V17H15V24H17V17H24V15H17Z" />
        </svg>
      </Link>
    </div>
  );
}
