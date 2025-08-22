import { useEffect } from 'react';
import { saveFeedState } from '../utils/scroll-restore';


export default function ArticleShell({ children }) {
// When this route mounts, snapshot current feed scroll/items have already been saved per hook.
// Optionally, on unmount we can persist again.
useEffect(() => {
return () => {
// Best-effort touch (items saved in the hook on each load); keep scroll fresh
try {
const raw = sessionStorage.getItem('feed:restore:v1');
if (raw) {
const snap = JSON.parse(raw);
saveFeedState({ ...snap, scrollY: window.scrollY });
}
} catch {}
};
}, []);


return (
<main className="min-h-screen bg-neutral-950 text-neutral-50">
{children}
</main>
);
}