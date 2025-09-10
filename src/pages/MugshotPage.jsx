import MugshotGrid from "../components/MugshotGrid.jsx";

export default function MugshotPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header>
          <h1 className="text-2xl font-bold">Mugshot Moderation</h1>
          <p className="text-neutral-400 text-sm">
            Delete or manage uploaded mugshots
          </p>
        </header>

        <MugshotGrid />
      </div>
    </div>
  );
}
