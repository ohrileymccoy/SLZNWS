import { useCallback } from 'react';
import InfiniteSentinel from './InfiniteSentinel';
import { useInfiniteArticles } from '../hooks/useInfiniteArticles';


function ArticleCard({ item }) {
return (
<article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 mb-4">
<a href={`/article/${item.slug}`} className="block">
<h2 className="text-xl font-semibold mb-1">{item.title}</h2>
{item.dek && <p className="text-sm text-neutral-300">{item.dek}</p>}
{/* Reserve space for hero to avoid CLS */}
{item.hero_image && (
<div className="mt-3 aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-800">
<img src={`/${item.hero_image}`} alt="" className="h-full w-full object-cover" loading="lazy" />
</div>
)}
<div className="mt-3 text-xs text-neutral-400">{item.section?.toUpperCase()} • {new Date(item.created_at).toLocaleString()}</div>
</a>
</article>
);
}


export default function Feed({ section = null }) {
const { items, status, error, isEnd, online, loadMore, retry } = useInfiniteArticles({ section });


const onIntersect = useCallback(() => {
// Only attempt when idle/online; guards live inside loadMore
loadMore();
}, [loadMore]);


return (
<div className="mx-auto max-w-3xl px-4">
{items.map((it) => (
<ArticleCard key={it.id} item={it} />
))}</div>)
}