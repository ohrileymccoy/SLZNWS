-- Articles table (MVP)
CREATE TABLE IF NOT EXISTS articles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  title        TEXT    NOT NULL,
  dek          TEXT,
  body         TEXT    NOT NULL,
  author       TEXT    NOT NULL,
  section      TEXT    NOT NULL CHECK(section IN ('news','culture','sports')),
  hero_image   TEXT,
  created_at   TEXT    NOT NULL, -- ISO 8601 UTC
  updated_at   TEXT    NOT NULL, -- ISO 8601 UTC
  is_published INTEGER NOT NULL DEFAULT 0, -- 0/1 boolean
  is_featured  INTEGER NOT NULL DEFAULT 0  -- 0/1 boolean
);

-- Sorting & filtering accelerator
CREATE INDEX IF NOT EXISTS idx_articles_pub_created_id
  ON articles(is_published, created_at DESC, id DESC);

-- Optional: section filter accelerator
CREATE INDEX IF NOT EXISTS idx_articles_section_pub_created
  ON articles(section, is_published, created_at DESC, id DESC);

  CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE,
  title TEXT,
  description TEXT,
  r2_key TEXT,              -- e.g. "media/videos/2025/08/uuid.mp4"
  mime TEXT,                -- "video/mp4"
  duration_seconds INTEGER, -- optional (client-populated)
  poster_key TEXT,          -- optional: "media/thumbs/uuid.jpg"
  captions_key TEXT,        -- optional: "media/captions/uuid.vtt"
  status TEXT DEFAULT 'uploaded', -- 'uploaded' | 'ready'
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  is_published INTEGER DEFAULT 0
);

