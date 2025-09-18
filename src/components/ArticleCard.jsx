import { Link } from "react-router-dom";
import CommentPreview from "./CommentPreview.jsx";

export default function ArticleCard({
  title,
  eyebrow,       // section label
  caption,       // description text
  footer,        // footer text (uploaded date)
  videoUrl,      // if present → video post
  posterUrl,     // video poster
  videoId,       // DB id for video (used in comment preview)
  photoUrls,     // array of photo URLs for photo post
  photoId,       // DB id for photo
  id,            // generic fallback id
}) {
  const isVideo = !!videoUrl;
  const isPhoto = !!photoUrls && photoUrls.length > 0;

  const CardInner = (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 transition-colors overflow-hidden">
      <div className="aspect-video">
        {isVideo ? (
          <video
            className="w-full h-full"
            controls
            playsInline
            preload="metadata"
            poster={posterUrl || undefined}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : isPhoto ? (
          <div className="grid grid-cols-2 gap-1 w-full h-full object-cover p-1">
            {photoUrls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={title || `photo-${i}`}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-neutral-800" />
        )}
      </div>

      <div className="p-3">
        {eyebrow && (
          <div className="uppercase tracking-widest text-[10px] text-neutral-400 mb-1">
            {eyebrow}
          </div>
        )}

        {title && (
          <h3 className="text-sm font-semibold line-clamp-2">
            <Link
              to={`/article/${videoId || photoId || id}`}
              className="hover:underline"
            >
              {title}
            </Link>
          </h3>
        )}

        {caption && (
          <p className="text-xs text-neutral-400 mt-1">
            <Link
              to={`/article/${videoId || photoId || id}`}
              className="hover:underline"
            >
              {caption}
            </Link>
          </p>
        )}

        {footer && (
          <div className="mt-2 text-xs text-neutral-500">{footer}</div>
        )}

        {/* Only show comments for videos */}
        {isVideo && videoId && <CommentPreview videoId={videoId} />}
      </div>
    </div>
  );

  return CardInner;
}
