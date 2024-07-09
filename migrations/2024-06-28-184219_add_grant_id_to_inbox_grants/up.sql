-- Your SQL goes here
ALTER TABLE inbox_grants ADD COLUMN grant_id UUID NOT NULL UNIQUE;