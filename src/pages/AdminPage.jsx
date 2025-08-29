// src/pages/AdminPage.jsx
import UploadVideo from "../components/UploadVideo.jsx";
import VideoGrid from "../components/VideoGrid.jsx";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin — Upload Video</h1>
        </header>

        <UploadVideo />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Latest Videos</h2>
          <VideoGrid />
        </div>
      </div>
    </div>
  );
}
