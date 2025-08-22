export async function fetchArticles({ cursor = null, limit = 20, section = null, signal }) {
const params = new URLSearchParams();
if (limit) params.set('limit', String(Math.min(Math.max(1, limit), 20)));
if (cursor) params.set('cursor', cursor);
if (section) params.set('section', section);


const res = await fetch(`/api/v1/articles?${params.toString()}`, {
headers: { 'Accept': 'application/json' },
signal,
credentials: 'same-origin',
});


if (!res.ok) {
const text = await res.text().catch(() => '');
throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
}
return res.json(); // { items: [...], nextCursor: string|null }
}