import { useState } from "react";
import { Link } from "react-router-dom";
import CommentPreview from "./CommentPreview.jsx";

export default function ArticleCard({
  title,
  eyebrow,
  caption,   // keep as caption for now (backend + feed logic compatibility)
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

  // Track aspect ratio for video only
  const [aspect, setAspect] = useState(16 / 9);

  function handleMediaLoad(e) {
    const { videoWidth, videoHeight } = e.target;
    if (videoWidth && videoHeight) {
      setAspect(videoWidth / videoHeight);
    }
  }

  // 👇 unified link logic
  const linkTarget = isVideo
    ? `/article/${videoId}`
    : isPhoto
    ? `/photo/${photoId}`
    : "#";

  const CardInner = (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors overflow-hidden">
      {/* Media */}
      {isVideo ? (
        <div style={{ aspectRatio: aspect }}>
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
        </div>
      ) : isPhoto ? (
        <div className="w-full p-1">
          {photoUrls.length === 1 ? (
            // Single photo → natural aspect
            <img
              src={photoUrls[0]}
              alt={title || "photo"}
              className="w-full h-auto rounded"
              loading="lazy"
            />
          ) : (
            // Multiple photos → grid, no stretch
            <div className="grid grid-cols-2 gap-1">
              {photoUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={title || `photo-${i}`}
                  className="w-full h-auto rounded"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // Placeholder background if no media
        <div className="w-full h-full bg-neutral-800" />
      )}

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
          // Plain preview text — no longer wrapped in <Link>
          <p className="text-xs text-neutral-400 mt-1">{caption}</p>
        )}

        {footer && (
          <div className="mt-2 text-xs text-neutral-500">{footer}</div>
        )}

        {/* Show preview comments (videos or photos) */}
{isVideo && videoId && <CommentPreview videoId={videoId} />}
{isPhoto && photoId && <CommentPreview photoId={photoId} />}

      </div>
    </div>
  );

  return CardInner;
}
// weird stuff happening with this file
