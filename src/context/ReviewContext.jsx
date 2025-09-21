import { createContext, useContext, useState } from "react";
import { getMovieReviews, getUserReviews, deleteReview, addReview } from "../services/reviews.js";
import { useUser } from "./useUser.js";

const ReviewContext = createContext();

export function ReviewProvider({ children }) {
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reviews for a specific movie
  const fetchMovieReviews = async (movieId) => {
    if (!movieId) return;
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

  // Fetch all reviews by the logged-in user
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

  // Add a new review (then refresh reviews for that movie)
  const addMovieReview = async (movieId, movieTitle, rating, reviewText) => {
    if (!user?.token) return;
    try {
      await addReview(movieId, movieTitle, rating, reviewText, user.token);
      await fetchMovieReviews(movieId); // refresh after saving
    } catch (err) {
      console.error("Failed to save review", err);
    }
  };

  // Delete a review (then remove from local state)
  const deleteReviewById = async (id) => {
    if (!user?.token) return;
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
        addMovieReview,
        deleteReviewById,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewContext);
}