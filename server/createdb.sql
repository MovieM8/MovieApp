-- Drop tables safely (in dependency order)
DROP TABLE IF EXISTS reviews, favorites, group_members, movie_groups, users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Groups table (renamed from "groups")
CREATE TABLE IF NOT EXISTS movie_groups (
    id SERIAL PRIMARY KEY,
    groupname VARCHAR(100) NOT NULL UNIQUE,
    groupowner INTEGER NOT NULL,
    groupmovie VARCHAR(255) NOT NULL
);

-- Group members table (renamed to group_members for consistency)
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
        REFERENCES movie_groups (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_fav FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    movie VARCHAR(255) NOT NULL,
    rating SMALLINT NOT NULL,
    review TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_user_review FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create role if not exists
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dbuser') THEN
      CREATE ROLE dbuser LOGIN PASSWORD 'Qwerty123';
   ELSE
      ALTER ROLE dbuser WITH PASSWORD 'Qwerty123' LOGIN;
   END IF;
END
$$;

-- Helpful indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members (user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews (user_id);

-- Revoke first
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM dbuser;

-- Grant adequate rights (read, insert, update, delete)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dbuser;

-- Also grant sequence usage for inserts (needed for serial ID)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO dbuser;

