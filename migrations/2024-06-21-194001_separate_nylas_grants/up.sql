-- Your SQL goes here
ALTER TABLE users DROP COLUMN grant_token;

CREATE TABLE IF NOT EXISTS inbox_grants (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    grant_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    email_provider TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_inbox_grants_user_id ON inbox_grants (user_id);
CREATE INDEX IF NOT EXISTS idx_inbox_grants_grant_token ON inbox_grants (grant_token);