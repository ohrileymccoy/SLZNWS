import Feed from '../components/Feed';


export default function Home() {
return (
<main className="min-h-screen bg-neutral-950 text-neutral-50 py-6">
<div className="sticky top-0 z-10 backdrop-blur bg-neutral-950/60 border-b border-white/10">
<div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
<h1 className="text-lg font-semibold tracking-tight">Oak Hill News</h1>
<div className="text-xs text-neutral-400">Infinite Feed (Phase 7)</div>
</div>
</div>
<Feed />
</main>
);
}