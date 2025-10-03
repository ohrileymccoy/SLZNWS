-- migrations/013_add_search_indexes.sql

-- Speed up title/description/caption lookups for videos
CREATE INDEX IF NOT EXISTS idx_videos_title ON videos(title);
CREATE INDEX IF NOT EXISTS idx_videos_description ON videos(description);
CREATE INDEX IF NOT EXISTS idx_videos_caption ON videos(caption);

-- Speed up title/caption lookups for photos
CREATE INDEX IF NOT EXISTS idx_photos_title ON photos(title);
CREATE INDEX IF NOT EXISTS idx_photos_caption ON photos(caption);
