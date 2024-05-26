-- Your SQL goes here
CREATE TABLE IF NOT EXISTS messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid NOT NULL,
    user_id uuid NOT NULL,
    external_id TEXT NOT NULL,
    subject_override TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_group_id ON messages (group_id);
CREATE INDEX idx_messages_user_id ON messages (user_id);
CREATE INDEX idx_messages_external_id ON messages (external_id);