import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!q) return;
    fetch(`/api/v1/videos/search?q=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setResults(data.items || []));
  }, [q]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Search results for "{q}"</h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="space-y-3">
          {results.map((v) => (
            <li key={v.id} className="border-b border-neutral-800 pb-2">
              <a href={`/video/${v.slug}`} className="hover:underline text-neutral-200">
                {v.title}
              </a>
              <p className="text-sm text-neutral-400">{v.caption}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
