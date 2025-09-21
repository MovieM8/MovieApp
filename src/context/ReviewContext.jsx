import { createContext, useContext, useState, useEffect } from "react";
import { getMovieReviews, getUserReviews, deleteReview, addReview } from "../services/reviews.js";
import { useUser } from "./useUser.js";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
    const { user } = useUser();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch reviews for a movie
    const fetchMovieReviews = async (movieId) => {
        try {
            setLoading(true);
            const data = await getMovieReviews(movieId, user?.token);
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch movie reviews", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch reviews by logged-in user
    const fetchUserReviews = async () => {
        if (!user?.token) return;
        try {
            setLoading(true);
            const data = await getUserReviews(user.token);
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch user reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const addMovieReview = async (movieId, movieTitle, rating, reviewText) => {
        try {
            const saved = await addReview(movieId, movieTitle, rating, reviewText, user.token);
        } catch (err) {
            console.error("Failed to save review", err);
            
        }
    }
    // Optimistically add a review
    /*const addReviewOptimistic = async (movieId, movieTitle, rating, reviewText) => {
      if (!user) return;
  
      const optimisticReview = {
        id: 9999999, // temp ID
        movieid: movieId,
        movie: movieTitle,
        rating,
        review: reviewText,
        username: user.username,
        userid: user.id,
        created_at: new Date().toISOString(),
        optimistic: true,
      };
  
      setReviews((prev) => [optimisticReview, ...prev]);
  
      try {
        const saved = await addReview(movieId, movieTitle, rating, reviewText, user.token);
        // Replace optimistic with real saved review
        setReviews((prev) =>
          prev.map((r) => (r.id === optimisticReview.id ? saved : r))
        );
      } catch (err) {
        console.error("Failed to save review", err);
        // rollback optimistic
        setReviews((prev) => prev.filter((r) => r.id !== optimisticReview.id));
      }
    };*/

    const deleteReviewById = async (id) => {
        try {
            await deleteReview(id, user.token);
            setReviews((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Failed to delete review", err);
        }
    };

    return (
        <ReviewContext.Provider
            value={{
                reviews,
                setReviews,
                loading,
                fetchMovieReviews,
                fetchUserReviews,
                //addReviewOptimistic,
                deleteReviewById,
                addMovieReview,
            }}
        >
            {children}
        </ReviewContext.Provider>
    );
}

export function useReviews() {
    return useContext(ReviewContext);
}