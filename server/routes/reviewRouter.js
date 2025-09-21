import { Router } from "express";
import { createReview, listReviewsByMovie, listReviewsByUser, deleteReview } from "../controllers/ReviewController.js";
import { auth } from "../helper/auth.js";

const router = Router();

// Add review
router.post("/", auth, createReview);

// Get all reviews for a movie (public)
router.get("/movie/:movieid", listReviewsByMovie);

// Get all reviews by logged-in user
router.get("/my", auth, listReviewsByUser);

// Delete a review
router.delete("/:reviewId", auth, deleteReview);

export default router;