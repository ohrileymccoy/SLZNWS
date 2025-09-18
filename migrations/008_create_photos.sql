-- migrations/000X_create_photos.sql
CREATE TABLE IF NOT EXISTS photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  caption TEXT,
  section TEXT DEFAULT 'news',
  r2_keys TEXT NOT NULL,        -- JSON array of R2 paths for batch uploads
  mime TEXT,                    -- e.g. "image/jpeg"
  status TEXT NOT NULL DEFAULT 'uploaded',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_photos_created_at
  ON photos (datetime(created_at) DESC);
