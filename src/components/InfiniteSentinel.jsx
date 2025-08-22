import { useEffect, useRef } from 'react';


/**
* Renders a sentinel that calls onIntersect when it approaches the viewport.
* Does not fire while disabled.
*/
export default function InfiniteSentinel({ disabled, onIntersect }) {
const ref = useRef(null);


useEffect(() => {
if (disabled) return; // observer detached when disabled
const el = ref.current;
if (!el) return;


const obs = new IntersectionObserver(
(entries) => {
for (const e of entries) {
if (e.isIntersecting) {
onIntersect?.();
}
}
},
{
root: null,
rootMargin: '0px 0px 600px 0px', // prefetch before bottom
threshold: 0,
}
);


obs.observe(el);
return () => obs.disconnect();
}, [disabled, onIntersect]);


return (
<div
ref={ref}
aria-hidden
className="h-4 w-full"
// Visual debug (optional): add border to see it
// style={{ outline: '1px dashed #333' }}
/>
);
}