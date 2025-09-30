-- Drop tables safely 
DROP TABLE IF EXISTS reviews, favorites, sharedfavorites, group_chat, group_members, group_times, movie_groups, screen_times, movies, users CASCADE;

GRANT ALL ON SCHEMA public TO dbuser;


-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE
);

-- Movies table
CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    movie TEXT NOT NULL,
    tmdbid INTEGER NOT NULL UNIQUE
);

-- Movie screening time table
CREATE TABLE IF NOT EXISTS screen_times (
    id SERIAL PRIMARY KEY,
    showid INTEGER NOT NULL UNIQUE,
    theatreid INTEGER NOT NULL,
    theatre TEXT NOT NULL,
    auditorium TEXT,
    starttime TIMESTAMP NOT NULL,
    movie TEXT NOT NULL,
    tmdbid INTEGER
);

-- Groups table 
CREATE TABLE IF NOT EXISTS movie_groups (
    id SERIAL PRIMARY KEY,
    groupname VARCHAR(100) NOT NULL UNIQUE,
    groupowner INTEGER NOT NULL,
    groupmovie TEXT,
    movieid INTEGER,
    CONSTRAINT fk_movie_group FOREIGN KEY (movieid)
        REFERENCES movies (tmdbid)
        ON DELETE RESTRICT ON UPDATE CASCADE
    CONSTRAINT unique_user_group UNIQUE (user_id, group_id)
);

-- Group members table 
CREATE TABLE IF NOT EXISTS group_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    pending BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_user FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
        REFERENCES movie_groups (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Group times table 
CREATE TABLE IF NOT EXISTS group_times (
    id SERIAL PRIMARY KEY,
    group_id INTEGER NOT NULL,
    screentimeid INTEGER NOT NULL,
    CONSTRAINT fk_sctime FOREIGN KEY (screentimeid)
        REFERENCES screen_times (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_group FOREIGN KEY (group_id)
        REFERENCES movie_groups (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    movieid INTEGER NOT NULL,
    movie TEXT,
    CONSTRAINT fk_user_fav FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_movie_fav FOREIGN KEY (movieid)
        REFERENCES movies (tmdbid)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Group chat table 
CREATE TABLE IF NOT EXISTS group_chat (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    group_id INTEGER NOT NULL,
    msg TEXT NOT NULL,
    send_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user_chat FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_group_chat FOREIGN KEY (group_id)
        REFERENCES movie_groups (id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    --movie VARCHAR(255) NOT NULL,
    movieid INTEGER NOT NULL,
    rating SMALLINT NOT NULL,
    review TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_user_review FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_movie_review FOREIGN KEY (movieid)
        REFERENCES movies (tmdbid)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Sharedfavorites table
CREATE TABLE IF NOT EXISTS sharedfavorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    sharelink TEXT DEFAULT NULL UNIQUE,
    CONSTRAINT fk_user_shared FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- Create role if not exists
/*
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'dbuser') THEN
      CREATE ROLE dbuser LOGIN PASSWORD 'Qwerty123';
   ELSE
      ALTER ROLE dbuser WITH PASSWORD 'Qwerty123' LOGIN;
   END IF;
END
$$;

*/ 

-- Helpful indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members (user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members (group_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_movie ON reviews (movieid);
CREATE INDEX IF NOT EXISTS idx_favorites_movie ON favorites (movieid);
CREATE INDEX IF NOT EXISTS idx_groups_movie ON movie_groups (movieid);
CREATE INDEX IF NOT EXISTS idx_group_times_screen_times ON group_times (screentimeid);
CREATE INDEX IF NOT EXISTS idx_group_times_group ON group_times (group_id);
CREATE INDEX IF NOT EXISTS idx_sharedfavorites_user ON sharedfavorites (user_id);
CREATE INDEX IF NOT EXISTS idx_group_chat_user ON group_chat (user_id);
CREATE INDEX IF NOT EXISTS idx_group_chat_group ON group_chat (group_id);

-- Revoke first
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM dbuser;

-- Grant adequate rights (read, insert, update, delete)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO dbuser;

-- Also grant sequence usage for inserts (needed for serial ID)
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO dbuser;


-- Insert 11 users (@example users password is Password123)
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

-- Insert movies
INSERT INTO movies (movie, tmdbid) VALUES
('Interstellar', 157336),
('The Hangover', 18785),
('Casablanca', 289),
('Avengers: Endgame', 299534),
('Toy Story', 862),
('Inception', 27205),
('The Matrix', 603),
('Frozen', 109445),
('The Dark Knight', 155),
('Shrek', 808);

-- Insert some groups (owned by users 1–3 for variety)
INSERT INTO movie_groups (groupname, groupowner, groupmovie, movieid) VALUES
('Sci-Fi Lovers', 1, 'Interstellar', 157336),
('Comedy Night', 2, 'The Hangover', 18785),
('Classic Cinema', 3, 'Casablanca', 289),
('Superhero Squad', 4, 'Avengers: Endgame', 299534),
('Animated Adventures', 5, 'Toy Story', 862);

-- Insert group members (each group has multiple users)
INSERT INTO group_members (user_id, group_id) VALUES
(1, 1), (2, 1), (3, 1), (6, 1), -- Sci-Fi Lovers
(2, 2), (4, 2), (5, 2), (7, 2), -- Comedy Night
(3, 3), (1, 3), (8, 3), (9, 3), -- Classic Cinema
(4, 4), (2, 4), (6, 4), (10, 4), -- Superhero Squad
(5, 5), (7, 5), (8, 5), (9, 5), (10, 5); -- Animated Adventures

-- Insert favorites (each user has at least one)
INSERT INTO favorites (user_id, movieid, movie) VALUES
(1, 157336, 'Interstellar'),
(2, 18785, 'The Hangover'),
(3, 289, 'Casablanca'),
(4, 299534, 'Avengers: Endgame'),
(5, 862, 'Toy Story'),
(6, 27205, 'Inception'),
(7, 603, 'The Matrix'),
(8, 109445, 'Frozen'),
(9, 155, 'The Dark Knight'),
(10, 808, 'Shrek');

-- Insert reviews (spread across users/movies)
INSERT INTO reviews (movieid, rating, review, user_id) VALUES
(157336, 4, 'Mind-blowing visuals and story.', 1),
(18785, 3, 'Really funny and entertaining.', 2),
(289, 5, 'A timeless masterpiece.', 3),
(299534, 4, 'Epic conclusion to the saga.', 4),
(862, 3, 'Heartwarming and nostalgic.', 5),
(27205, 4, 'Keeps you thinking long after.', 6),
(603, 5, 'Revolutionary sci-fi film.', 7),
(109445, 2, 'Great songs and animation.', 8),
(155, 5, 'Best superhero movie ever.', 9),
(808, 4, 'Funny for both kids and adults.', 10);