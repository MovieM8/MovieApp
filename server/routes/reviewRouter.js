import { Router } from "express";
import { createReview, listReviewsByMovie, listReviewsByUser, listAllReviews, deleteReview } from "../controllers/ReviewController.js";
import { auth } from "../helper/auth.js";

const router = Router();

// Add review
router.post("/", auth, createReview);

// Get all reviews for a movie (public)
router.get("/movie/:movieid", listReviewsByMovie);

// Get all reviews by logged-in user
router.get("/my", auth, listReviewsByUser);

// Get all reviews 
router.get("/all", listAllReviews);

// Delete a review
router.delete("/:reviewId", auth, deleteReview);

export default router;