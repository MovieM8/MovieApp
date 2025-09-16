-- Drop tables safely 
DROP TABLE IF EXISTS reviews, favorites, group_members, movie_groups, users CASCADE;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE
);

-- Groups table 
CREATE TABLE IF NOT EXISTS movie_groups (
    id SERIAL PRIMARY KEY,
    groupname VARCHAR(100) NOT NULL UNIQUE,
    groupowner INTEGER NOT NULL,
    groupmovie VARCHAR(255)
);

-- Group members table 
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
        REFERENCES movie_groups (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movie VARCHAR(255) NOT NULL,
    sharelink VARCHAR(255) NOT NULL,
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


-- Insert 11 users
INSERT INTO users (email, password, username) VALUES
('alice@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'alice'),
('bob@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'bob'),
('carol@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'carol'),
('dave@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'dave'),
('eve@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'eve'),
('frank@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'frank'),
('grace@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'grace'),
('heidi@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'heidi'),
('ivan@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'ivan'),
('judy@example.com', '$2b$10$CywVweSsgWAgSr2dHLd3WujvQY77Vh86TWKSI8kf8waaG.5ueHtIC', 'judy'),
('test@test.com', '$2b$10$//aWOj06Y0ew5bI2vDZzQOouf/uSty55MFpQSZZNFX6Lfw4xwRRpi', 'Tester');


-- Insert some groups (owned by users 1–3 for variety)
INSERT INTO movie_groups (groupname, groupowner, groupmovie) VALUES
('Sci-Fi Lovers', 1, 'Interstellar'),
('Comedy Night', 2, 'The Hangover'),
('Classic Cinema', 3, 'Casablanca'),
('Superhero Squad', 4, 'Avengers: Endgame'),
('Animated Adventures', 5, 'Toy Story');

-- Insert group members (each group has multiple users)
INSERT INTO group_members (user_id, group_id) VALUES
(1, 1), (2, 1), (3, 1), (6, 1), -- Sci-Fi Lovers
(2, 2), (4, 2), (5, 2), (7, 2), -- Comedy Night
(3, 3), (1, 3), (8, 3), (9, 3), -- Classic Cinema
(4, 4), (2, 4), (6, 4), (10, 4), -- Superhero Squad
(5, 5), (7, 5), (8, 5), (9, 5), (10, 5); -- Animated Adventures

-- Insert favorites (each user has at least one)
INSERT INTO favorites (user_id, movie, sharelink) VALUES
(1, 'Interstellar', 'https://imdb.com/title/tt0816692/'),
(2, 'The Hangover', 'https://imdb.com/title/tt1119646/'),
(3, 'Casablanca', 'https://imdb.com/title/tt0034583/'),
(4, 'Avengers: Endgame', 'https://imdb.com/title/tt4154796/'),
(5, 'Toy Story', 'https://imdb.com/title/tt0114709/'),
(6, 'Inception', 'https://imdb.com/title/tt1375666/'),
(7, 'The Matrix', 'https://imdb.com/title/tt0133093/'),
(8, 'Frozen', 'https://imdb.com/title/tt2294629/'),
(9, 'The Dark Knight', 'https://imdb.com/title/tt0468569/'),
(10, 'Shrek', 'https://imdb.com/title/tt0126029/');

-- Insert reviews (spread across users/movies)
INSERT INTO reviews (movie, rating, review, user_id) VALUES
('Interstellar', 4, 'Mind-blowing visuals and story.', 1),
('The Hangover', 3, 'Really funny and entertaining.', 2),
('Casablanca', 5, 'A timeless masterpiece.', 3),
('Avengers: Endgame', 4, 'Epic conclusion to the saga.', 4),
('Toy Story', 3, 'Heartwarming and nostalgic.', 5),
('Inception', 4, 'Keeps you thinking long after.', 6),
('The Matrix', 5, 'Revolutionary sci-fi film.', 7),
('Frozen', 2, 'Great songs and animation.', 8),
('The Dark Knight', 5, 'Best superhero movie ever.', 9),
('Shrek', 4, 'Funny for both kids and adults.', 10);