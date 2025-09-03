import UploadVideo from "../components/UploadVideo.jsx";

export default function Submit() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Submit a Video</h1>
          <p className="text-sm text-neutral-400">
            Upload your video to Sleazy News. All submissions are subject to review.
          </p>
        </header>

        {/* Reuse the same form component */}
        <UploadVideo />
      </div>
    </div>
  );
}
