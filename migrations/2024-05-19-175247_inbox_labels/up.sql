-- Your SQL goes here
CREATE TABLE IF NOT EXISTS inbox_labels (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL,
    name TEXT NOT NULL,
    label_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_labels_user_id ON inbox_labels (user_id);
CREATE INDEX IF NOT EXISTS idx_labels_label_id ON inbox_labels (label_id);