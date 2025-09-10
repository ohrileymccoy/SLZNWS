-- migrations/006_create_mugshots.sql
CREATE TABLE IF NOT EXISTS mugshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,          -- safe identifier
  name TEXT NOT NULL,                 -- display name
  r2_key TEXT NOT NULL,               -- path in R2, e.g. "media/mugshots/2025/09/uuid.jpg"
  status TEXT NOT NULL DEFAULT 'uploaded', -- control publish state
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE INDEX IF NOT EXISTS idx_mugshots_created
  ON mugshots (datetime(created_at) DESC);
