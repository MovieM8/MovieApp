-- Drop tables safely
DROP TABLE IF EXISTS reviews, favorites, groupmembers, groups, users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS moviedb.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Groups table (renamed column "group" → "id")
CREATE TABLE IF NOT EXISTS moviedb.groups (
    id SERIAL PRIMARY KEY,
    groupname VARCHAR(100) NOT NULL UNIQUE,
    groupowner INTEGER NOT NULL,
    groupmovie VARCHAR(255) NOT NULL
);

-- Group members table
CREATE TABLE IF NOT EXISTS moviedb.groupmembers (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    groupid INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (userid)
        REFERENCES moviedb.users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (groupid)
        REFERENCES moviedb.groups (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS moviedb.favorites (
    id SERIAL PRIMARY KEY,
    userid INTEGER NOT NULL,
    movie VARCHAR(255) NOT NULL,
    CONSTRAINT fk_user_fav FOREIGN KEY (userid)
        REFERENCES moviedb.users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS moviedb.reviews (
    id SERIAL PRIMARY KEY,
    movie VARCHAR(255) NOT NULL,
    rating SMALLINT NOT NULL,
    review TEXT NOT NULL,
    userid INTEGER NOT NULL,
    CONSTRAINT fk_user_review FOREIGN KEY (userid)
        REFERENCES moviedb.users (id)
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

-- Revoke first
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA moviedb FROM dbuser;

-- Grant table rights
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA moviedb TO dbuser;

-- Grant sequence usage (serial IDs)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA moviedb TO dbuser;