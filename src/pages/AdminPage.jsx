// src/pages/AdminPage.jsx
import { useState } from "react";
import UploadVideo from "../components/UploadVideo.jsx";
import VideoGrid from "../components/VideoGrid.jsx";

export default function AdminPage() {
  const [refreshNonce, setRefreshNonce] = useState(0); // force re-mount of VideoGrid to refetch

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin — Upload Video</h1>
        </header>

        {/* Upload form */}
        <UploadVideo />

        {/* Latest videos grid */}
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Latest Videos</h2>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-neutral-400">
                New upload not showing? Refresh the grid.
              </span>
              <button
                onClick={() => setRefreshNonce((n) => n + 1)}
                className="px-2 py-1 rounded border border-neutral-700 text-xs hover:bg-neutral-900"
                title="Refresh"
              >
                ↻ Refresh
              </button>
            </div>
          </div>

          {/* adminMode enables delete + section controls inside the grid */}
          <VideoGrid key={refreshNonce} adminMode />
        </section>
      </div>
    </div>
  );
}
