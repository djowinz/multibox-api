-- This file should undo anything in `up.sql`
DROP INDEX IF EXISTS idx_groups_user_id;
DROP TABLE IF EXISTS groups;