import UploadPhoto from "../components/UploadPhoto.jsx";

export default function SubmitPhoto() {
  return (
    <div className="w-full min-h-screen bg-neutral-950 text-neutral-100 px-4 sm:px-6 md:px-8 py-10 overflow-x-hidden">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">Submit Photos</h1>
        <p className="text-sm text-neutral-400">
          Upload photos to Sleazy News. All submissions are subject to review.
        </p>
      </header>

      {/* Upload form fills container */}
      <div className="w-full">
        <UploadPhoto />
      </div>
    </div>
  );
}
