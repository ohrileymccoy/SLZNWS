ALTER TABLE videos ADD COLUMN section TEXT DEFAULT 'news';
ALTER TABLE videos ADD COLUMN caption TEXT;
ALTER TABLE videos ADD COLUMN is_seed INTEGER DEFAULT 0;
-- created_at already exists, don’t add again
