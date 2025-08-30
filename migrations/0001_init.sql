-- migrations/0001_init.sql
CREATE TABLE IF NOT EXISTS videos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT,
  description TEXT,
  r2_key TEXT NOT NULL,
  mime TEXT,
  status TEXT DEFAULT 'uploaded',
  created_at TEXT DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
