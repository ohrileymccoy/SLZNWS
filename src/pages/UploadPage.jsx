// src/pages/UploadPage.jsx
import UploadVideo from "../components/UploadVideo.jsx";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-3xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold">Upload a Video</h1>
          <p className="text-neutral-400 text-sm">
            Anyone can upload. Videos will appear once processed.
          </p>
        </header>
        <UploadVideo />
      </div>
    </div>
  );
}
