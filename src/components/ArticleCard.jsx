import { useState } from "react";
import { Link } from "react-router-dom";
import CommentPreview from "./CommentPreview.jsx";

export default function ArticleCard({
  title,
  eyebrow,
  caption,
  footer,
  videoUrl,
  posterUrl,
  videoId,
  photoUrls,
  photoId,
  id,
}) {
  const isVideo = !!videoUrl;
  const isPhoto = !!photoUrls && photoUrls.length > 0;

  // Track aspect ratio of first media (default 16/9)
  const [aspect, setAspect] = useState(16 / 9);

  function handleMediaLoad(e) {
    const { videoWidth, videoHeight, naturalWidth, naturalHeight } = e.target;
    const w = videoWidth || naturalWidth;
    const h = videoHeight || naturalHeight;
    if (w && h) setAspect(w / h);
  }

  // 👇 unified link logic
  const linkTarget = isVideo
    ? `/article/${videoId}`
    : isPhoto
    ? `/photo/${photoId}`
    : "#";

  const CardInner = (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors overflow-hidden">
      {/* Media wrapper with dynamic aspect ratio */}
      <div style={{ aspectRatio: aspect }}>
        {isVideo ? (
          <video
            className="w-full h-full object-cover"
            controls
            playsInline
            preload="metadata"
            poster={posterUrl || undefined}
            onLoadedMetadata={handleMediaLoad}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : isPhoto ? (
          <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
            {photoUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={title || `photo-${i}`}
                className="w-full h-full object-cover rounded"
                loading="lazy"
                onLoad={i === 0 ? handleMediaLoad : undefined} // only need first image
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
      </div>

      {/* Text + footer */}
      <div className="p-3">
        {eyebrow && (
          <div className="uppercase tracking-widest text-[10px] text-neutral-400 mb-1">
            {eyebrow}
          </div>
        )}

        {title && (
          <h3 className="text-sm font-semibold line-clamp-2">
            <Link to={linkTarget} className="hover:underline">
              {title}
            </Link>
          </h3>
        )}

        {caption && (
          <p className="text-xs text-neutral-400 mt-1">
            <Link to={linkTarget} className="hover:underline">
              {caption}
            </Link>
          </p>
        )}

        {footer && (
          <div className="mt-2 text-xs text-neutral-500">{footer}</div>
        )}

        {isVideo && videoId && <CommentPreview videoId={videoId} />}
      </div>
    </div>
  );

  return CardInner;
}
