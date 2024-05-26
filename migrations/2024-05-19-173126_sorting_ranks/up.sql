-- Your SQL goes here
CREATE TABLE IF NOT EXISTS sorting_ranks (
    group_id uuid NOT NULL,
    message_id TEXT NOT NULL,
    rank INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (group_id, message_id),

    CONSTRAINT fk_group_id FOREIGN KEY(group_id) REFERENCES groups(id) ON DELETE CASCADE
    CONSTRAINT fk_message_id FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE
);