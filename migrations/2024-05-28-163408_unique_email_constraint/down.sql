-- This file should undo anything in `up.sql`
ALTER TABLE users DROP CONSTRAINT unique_email_constraint;
DROP INDEX IF EXISTS idx_users_unique_lower_email;