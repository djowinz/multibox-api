-- This file should undo anything in `up.sql`
ALTER TABLE IF EXISTS users DROP COLUMN last_login;