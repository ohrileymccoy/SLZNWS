import { useVideos } from "../hooks/useVideos";
import { usePhotos } from "../hooks/usePhotos";
import ArticleCard from "./ArticleCard";

export default function Feed({ section = null }) {
  const { items: videoItems, loading: loadingVideos } = useVideos({ section });
  const { items: photoItems, loading: loadingPhotos } = usePhotos({ section });

  const loading = loadingVideos || loadingPhotos;
  const merged = [...videoItems, ...photoItems].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">Loading feed…</p>
      </div>
    );
  }

  if (!merged.length) {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <p className="text-neutral-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4">
      {merged.map((it) =>
        it.videoUrl || it.public_url ? (
          <ArticleCard
            key={`video-${it.id}`}
            title={it.title}
            eyebrow={it.section}
            videoUrl={it.public_url}
            posterUrl={it.poster_key}
            caption={it.caption}
            footer={`Uploaded ${new Date(it.created_at).toLocaleDateString()}`}
            videoId={it.id}
          />
        ) : (
          <ArticleCard
            key={`photo-${it.id}`}
            title={it.title}
            eyebrow={it.section}
            caption={it.caption}
            footer={`Uploaded ${new Date(it.created_at).toLocaleDateString()}`}
            photoUrls={it.photoUrls} // 👈 added for photo sets
            photoId={it.id}
          />
        )
      )}
    </div>
  );
}
