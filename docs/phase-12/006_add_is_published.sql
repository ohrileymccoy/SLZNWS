-- Add is_published if missing
ALTER TABLE videos ADD COLUMN is_published INTEGER DEFAULT 0;

-- Add updated_at if missing (nullable, app logic will populate it)
ALTER TABLE videos ADD COLUMN updated_at TEXT;
