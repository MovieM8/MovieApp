import { pool } from "../helper/db.js";

// Insert movie into movies table if not exists
const insertMovieIfNotExists = async (tmdbid, movie) => {
    const client = await pool.connect();
    try {
        const result = await client.query(
            "INSERT INTO movies (tmdbid, movie) VALUES ($1, $2) ON CONFLICT (tmdbid) DO NOTHING RETURNING *",
            [tmdbid, movie]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Add favorite for user
const addFavorite = async (userId, tmdbid, movie) => {
    const client = await pool.connect();
    try {
        await insertMovieIfNotExists(tmdbid, movie);
        const result = await client.query(
            "INSERT INTO favorites (user_id, movieid, movie) VALUES ($1, $2, $3) RETURNING *",
            [userId, tmdbid, movie]
        );
        return result.rows[0];
    } finally {
        client.release();
    }
};

// Get all favorites for user
const getFavoritesByUser = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM favorites WHERE user_id = $1",
        [userId]
    );
    return result.rows;
};

// Remove favorite
const removeFavorite = async (userId, movieId) => {
    const result = await pool.query(
        "DELETE FROM favorites WHERE user_id = $1 AND movieid = $2 RETURNING *",
        [userId, movieId]
    );
    return result.rows[0];
};


// Get favorites sharelink for user
const getFavoriteShare = async (userId) => {
    const result = await pool.query(
        "SELECT * FROM sharedfavorites WHERE user_id = $1",
        [userId]
    );
    return result.rows;
};

// Insert or update (upsert) sharelink
const upsertFavoriteShare = async (userId, sharelink = null) => {
    const result = await pool.query(
        `INSERT INTO sharedfavorites (user_id, sharelink)
         VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET sharelink = EXCLUDED.sharelink
         RETURNING *`,
        [userId, sharelink]
    );
    return result.rows[0];
};

// Remove favorite sharelink
const removeFavoriteShare = async (userId) => {
    const result = await pool.query(
        "DELETE FROM sharedfavorites WHERE user_id = $1 RETURNING *",
        [userId]
    );
    return result.rows[0];
};

// Get users shared favorite list
const getSharedFavorites = async (sharelink) => {
    const result = await pool.query(
            `SELECT f.movieid, f.movie, u.username
             FROM favorites f
             JOIN users u ON u.id = f.user_id
             JOIN sharedfavorites s ON s.user_id = u.id
             WHERE s.sharelink = $1`,
            [sharelink]
        );
    return result.rows;
};


export { addFavorite, getFavoritesByUser, removeFavorite, getFavoriteShare, upsertFavoriteShare, removeFavoriteShare, getSharedFavorites };