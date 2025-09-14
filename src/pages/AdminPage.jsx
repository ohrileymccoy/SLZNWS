// src/pages/AdminPage.jsx
import { useState } from "react";
import UploadVideo from "../components/UploadVideo.jsx";
import VideoGrid from "../components/VideoGrid.jsx";
import UploadMugshot from "../components/UploadMugshot.jsx"; // ⬅️ new import
import AdminComments from "./AdminComments.jsx";
export default function AdminPage() {
  const [refreshNonce, setRefreshNonce] = useState(0); // force re-mount of VideoGrid
  const [tab, setTab] = useState("videos");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </header>

        {/* Tab buttons */}
        <div className="flex gap-3 border-b border-neutral-800 pb-3">
          <button
            onClick={() => setTab("videos")}
            className={`px-3 py-1 rounded ${
              tab === "videos" ? "bg-blue-600 text-white" : "bg-neutral-800"
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setTab("comments")}
            className={`px-3 py-1 rounded ${
              tab === "comments" ? "bg-blue-600 text-white" : "bg-neutral-800"
            }`}
          >
            Comments
          </button>
        </div>

        {/* Tab content */}
        <main className="space-y-8">
          {tab === "videos" && (
            <>
              {/* Upload form */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Upload Video</h2>
                <UploadVideo />
              </section>

              {/* Upload mugshots */}
              <section>
                <h2 className="text-xl font-semibold mb-3">Upload Mugshot</h2>
                <UploadMugshot />
              </section>

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
                <VideoGrid key={refreshNonce} adminMode />
              </section>
            </>
          )}

          {tab === "comments" && <AdminComments />}
        </main>
      </div>
    </div>
  );
}