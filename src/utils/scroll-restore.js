const KEY = 'feed:restore:v1';


export function saveFeedState({ scrollY, cursor, items }) {
try {
const ids = items.map((i) => i.id);
const snapshot = { t: Date.now(), scrollY, cursor, ids, items };
sessionStorage.setItem(KEY, JSON.stringify(snapshot));
} catch {}
}


export function loadFeedState() {
try {
const raw = sessionStorage.getItem(KEY);
if (!raw) return null;
const parsed = JSON.parse(raw);
return parsed;
} catch {
return null;
}
}


export function clearFeedState() {
try { sessionStorage.removeItem(KEY); } catch {}
}