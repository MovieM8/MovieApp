import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Add review
export const addReview = async (tmdbid, movie, rating, review, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/reviews`,
            { tmdbid, movie, rating, review },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to add Review", err);
        return [];
    }
};

// Delete review
export const deleteReview = async (reviewId, token) => {
    try {
        const res = await axios.delete(`${API_URL}/reviews/${reviewId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    }
    catch (err) {
        console.error("Failed to delete Review", err);
        return [];
    }
};

// Get reviews for a movie
export const getMovieReviews = async (movieId, token) => {
    try {
        const res = await axios.get(`${API_URL}/reviews/movie/${movieId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    }
    catch (err) {
        console.error("Failed to fetch Reviews for movie", err);
        return [];
    }
};

// Get all reviews
export const getAllMovieReviews = async () => {
    try {
        const res = await axios.get(`${API_URL}/reviews/all`);
        return res.data;
    }
    catch (err) {
        console.error("Failed to fetch all Reviews", err);
        return [];
    }
};

// Get reviews of the logged-in user
export const getUserReviews = async (token) => {
    try {
        const res = await axios.get(`${API_URL}/reviews/my`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    }
    catch (err) {
        console.error("Failed to fetch Reviews for user", err);
        return [];
    }
};