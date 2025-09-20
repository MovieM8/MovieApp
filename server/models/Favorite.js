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
const addFavorite = async (userId, tmdbid, movie, sharelink = null) => {
    const client = await pool.connect();
    try {
        await insertMovieIfNotExists(tmdbid, movie);
        const result = await client.query(
            "INSERT INTO favorites (user_id, movieid, movie, sharelink) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, tmdbid, movie, sharelink]
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



export { addFavorite, getFavoritesByUser, removeFavorite };