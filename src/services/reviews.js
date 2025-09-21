import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Add review
export const addReview = async (tmdbid, movie, rating, review, token) => {
    const res = await axios.post(
        `${API_URL}/reviews`,
        { tmdbid, movie, rating, review },
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return res.data;
};

// Delete review
export const deleteReview = async (reviewId, token) => {
    const res = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

// Get reviews for a movie
export const getMovieReviews = async (movieId, token) => {
    const res = await axios.get(`${API_URL}/reviews/movie/${movieId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
};

// Get reviews of the logged-in user
export const getUserReviews = async (token) => {
    const res = await axios.get(`${API_URL}/reviews/my`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};