export default function ArticleCard({ i = 1 }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="aspect-[16/9] w-full rounded-xl bg-neutral-800 mb-4" />
      <h3 className="text-lg font-semibold">Sample headline #{i}</h3>
      <p className="mt-1 text-sm text-neutral-300">Dek/subhead goes here to tease the story.</p>
    </article>
  );
}
