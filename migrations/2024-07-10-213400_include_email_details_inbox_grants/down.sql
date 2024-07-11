-- This file should undo anything in `up.sql`
ALTER TABLE IF EXISTS inbox_grants DROP COLUMN email;