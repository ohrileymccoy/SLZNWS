-- 009_alter_comments.sql

-- 1. Rename old table
ALTER TABLE comments RENAME TO comments_old;

-- 2. Create new table with photo_id support and nullable video_id
CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER,   -- now nullable
  photo_id INTEGER,   -- new column
  username TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE,
  FOREIGN KEY(photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

-- 3. Copy existing data (video comments only)
INSERT INTO comments (id, video_id, username, body, created_at)
SELECT id, video_id, username, body, created_at
FROM comments_old;

-- 4. Drop old table
DROP TABLE comments_old;

-- 5. Recreate indexes
CREATE INDEX IF NOT EXISTS idx_comments_video_created
  ON comments(video_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_photo_created
  ON comments(photo_id, created_at DESC);
