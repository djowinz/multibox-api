-- Your SQL goes here
CREATE TABLE IF NOT EXISTS groups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    message_cursor TEXT NOT NULL,
    page_cursor TEXT,
    title TEXT,
    background_color TEXT,
    collapsed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_groups_user_id ON groups (user_id);