-- This file should undo anything in `up.sql`
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_name;
DROP TABLE IF EXISTS users;