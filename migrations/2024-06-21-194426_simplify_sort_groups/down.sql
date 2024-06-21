-- This file should undo anything in `up.sql`
ALTER TABLE IF EXISTS email_groups DROP COLUMN sorting_order;