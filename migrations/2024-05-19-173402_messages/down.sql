-- This file should undo anything in `up.sql`
DROP INDEX IF EXISTS idx_messages_group_id;
DROP INDEX IF EXISTS idx_messages_user_id;
DROP INDEX IF EXISTS idx_messages_external_id;
DROP TABLE IF EXISTS messages;