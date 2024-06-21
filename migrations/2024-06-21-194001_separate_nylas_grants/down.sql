-- This file should undo anything in `up.sql`
ALTER TABLE users ADD COLUMN grant_token TEXT NOT NULL;
DROP INDEX IF EXISTS idx_email_grants_user_id;
DROP INDEX IF EXISTS idx_email_grants_grant_token;
DROP TABLE IF EXISTS email_grants;