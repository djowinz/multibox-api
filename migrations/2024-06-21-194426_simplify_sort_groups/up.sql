-- Your SQL goes here
DROP TABLE IF EXISTS sorting_ranks; -- This table is no longer needed and is an artifact cleanup for local envs
ALTER TABLE IF EXISTS groups ADD COLUMN sorting_order TEXT[];