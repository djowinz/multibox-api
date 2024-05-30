-- Your SQL goes here
ALTER TABLE users ADD CONSTRAINT unique_email_constraint UNIQUE (email);
CREATE UNIQUE INDEX idx_users_unique_lower_email on users (lower(email));