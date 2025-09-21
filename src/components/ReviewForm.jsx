import { useState } from "react";
import { addReview } from "../services/reviews.js";
import { useUser } from "../context/useUser.js";
import "./ReviewForm.css";

export default function ReviewForm({ movieId, movieTitle, onClose, onReviewAdded }) {
  const { user } = useUser();
  const [rating, setRating] = useState(3);
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setLoading(true);
      await addReview(movieId, movieTitle, rating, review, user.token);
      setReview("");
      setRating(3);
      if (onReviewAdded) onReviewAdded();
      onClose();
    } catch (err) {
      console.error("Failed to add review", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal">
        <h3>Write a review for {movieTitle}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your thoughts..."
            required
          />
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Submit"}
            </button>
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}