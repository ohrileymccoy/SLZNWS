-- db_init.sql
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  r2_key TEXT NOT NULL,          -- path in R2 like media/videos/2025/08/uuid.mp4
  mime TEXT,                     -- e.g. video/mp4
  poster_key TEXT,               -- optional poster path in R2
  captions_key TEXT,             -- optional captions path in R2
  status TEXT NOT NULL DEFAULT 'uploaded',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_videos_created_at
  ON videos (datetime(created_at) DESC);
