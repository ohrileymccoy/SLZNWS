-- 010_fix_comments_nullable.sql
PRAGMA foreign_keys=off;

ALTER TABLE comments RENAME TO comments_old;

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  video_id INTEGER,  -- now nullable
  photo_id INTEGER,  -- already nullable
  username TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY(video_id) REFERENCES videos(id) ON DELETE CASCADE,
  FOREIGN KEY(photo_id) REFERENCES photos(id) ON DELETE CASCADE
);

INSERT INTO comments (id, video_id, photo_id, username, body, created_at)
SELECT id, video_id, photo_id, username, body, created_at FROM comments_old;

DROP TABLE comments_old;

CREATE INDEX IF NOT EXISTS idx_comments_video_created
  ON comments(video_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_comments_photo_created
  ON comments(photo_id, created_at DESC);

PRAGMA foreign_keys=on;
