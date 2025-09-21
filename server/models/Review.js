import { pool } from "../helper/db.js";

// Insert movie if not exists
const insertMovieIfNotExists = async (tmdbid, movie) => {
  const client = await pool.connect();
  try {
    await client.query(
      "INSERT INTO movies (tmdbid, movie) VALUES ($1, $2) ON CONFLICT (tmdbid) DO NOTHING",
      [tmdbid, movie]
    );
  } finally {
    client.release();
  }
};

// Add review
const addReview = async (userId, tmdbid, movie, rating, review) => {
  const client = await pool.connect();
  try {
    await insertMovieIfNotExists(tmdbid, movie);
    const result = await client.query(
      `INSERT INTO reviews (user_id, movieid, rating, review) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, movieid, rating, review, user_id, created_at`,
      [userId, tmdbid, rating, review]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
};

// Get all reviews for a movie (with username)
const getReviewsByMovie = async (tmdbid) => {
  const result = await pool.query(
    `SELECT r.id, r.movieid, r.rating, r.review, r.created_at, r.user_id AS userid, u.username
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.movieid = $1
     ORDER BY r.created_at DESC`,
    [tmdbid]
  );
  return result.rows;
};

// Get all reviews by a user
const getReviewsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT r.id, r.movieid, r.rating, r.review, r.created_at, r.user_id AS userid, m.movie
     FROM reviews r
     JOIN movies m ON r.movieid = m.tmdbid
     WHERE r.user_id = $1
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return result.rows;
};

// Delete review (only owner can delete)
const removeReview = async (userId, reviewId) => {
  const result = await pool.query(
    "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *",
    [reviewId, userId]
  );
  return result.rows[0];
};

export { addReview, getReviewsByMovie, getReviewsByUser, removeReview };