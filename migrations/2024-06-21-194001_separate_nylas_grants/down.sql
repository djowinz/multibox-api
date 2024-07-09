-- This file should undo anything in `up.sql`
ALTER TABLE users ADD COLUMN grant_token TEXT;
DROP INDEX IF EXISTS idx_inbox_grants_user_id;
DROP INDEX IF EXISTS idx_inbox_grants_grant_token;
DROP TABLE IF EXISTS inbox_grants;