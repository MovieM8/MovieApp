import { addReview, getReviewsByMovie, getReviewsByUser, removeReview } from "../models/Review.js";
import { ApiError } from "../helper/ApiError.js";

const createReview = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(new ApiError("User not authenticated", 401));

    const { tmdbid, movie, rating, review } = req.body;
    if (!tmdbid || !movie || !rating || !review) {
      return next(new ApiError("tmdbid, movie, rating and review are required", 400));
    }
    if (rating < 1 || rating > 5) {
      return next(new ApiError("Rating must be between 1 and 5", 400));
    }

    const newReview = await addReview(userId, tmdbid, movie, rating, review);
    res.status(201).json(newReview);
  } catch (err) {
    next(err);
  }
};

const listReviewsByMovie = async (req, res, next) => {
  try {
    const { movieid } = req.params;
    const reviews = await getReviewsByMovie(movieid);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

const listReviewsByUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const reviews = await getReviewsByUser(userId);
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const deleted = await removeReview(userId, reviewId);
    if (!deleted) {
      return next(new ApiError("Review not found or not authorized", 404));
    }

    res.status(200).json({ message: "Review removed", deleted });
  } catch (err) {
    next(err);
  }
};

export { createReview, listReviewsByMovie, listReviewsByUser, deleteReview };