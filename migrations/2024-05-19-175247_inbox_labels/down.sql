-- This file should undo anything in `up.sql`
DROP INDEX IF EXISTS idx_labels_user_id;
DROP INDEX IF EXISTS idx_labels_label_id;
DROP TABLE IF EXISTS inbox_labels;