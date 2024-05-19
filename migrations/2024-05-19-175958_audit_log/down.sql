-- This file should undo anything in `up.sql`
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_audit_logs_row_id;
DROP TABLE IF EXISTS audit_log;