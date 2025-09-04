import { Link } from "react-router-dom";
import CommentPreview from "./CommentPreview.jsx";

export default function ArticleCard({
  title,
  href,              // optional link when NOT a video
  eyebrow,           // tiny label above title
  imageUrl,          // fallback image (when not a video)
  videoUrl,          // if present, render <video>
  posterUrl,         // optional poster for video
  caption,           // short text under title
  footer,            // optional footer area
  videoId,
}) {
  const isVideo = !!videoUrl;

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
        ) : (
          <img
            src={imageUrl}
            alt={title || ""}
            className="w-full h-full object-cover"
            loading="lazy"
          />
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
            <Link to={`/article/${videoId}`} className="hover:underline">
              {title}
            </Link>
          </h3>
        )}

        {caption && (
          <p className="text-xs text-neutral-400 mt-1">
            <Link to={`/article/${videoId}`} className="hover:underline">
              {caption}
            </Link>
          </p>
        )}

        {footer && (
          <div className="mt-2 text-xs text-neutral-500">{footer}</div>
        )}

        {/* Only show ONE preview comment in feed */}
        {isVideo && videoId && <CommentPreview videoId={videoId} />}
      </div>
    </div>
  );

  // Don’t wrap playable video in a link (prevents weird click behavior)
  if (!isVideo && href) {
    return (
      <a href={href} className="block">
        {CardInner}
      </a>
    );
  }

  return CardInner;
}
