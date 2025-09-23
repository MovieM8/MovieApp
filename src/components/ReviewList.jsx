import { useEffect, useState } from "react";
import { useUser } from "../context/useUser.js";
//import { getMovieReviews, getUserReviews, deleteReview } from "../services/reviews.js";
import "./ReviewList.css";
import { useReviews } from "../context/ReviewContext.jsx";
import { Link } from "react-router-dom"

export default function ReviewList({ movieId, userOnly = false }) {
  const { user } = useUser();
  const { reviews, loading, deleteReviewById, fetchMovieReviews, fetchAllReviews, fetchUserReviews } = useReviews();
  //const [reviews, setReviews] = useState([]);
  //const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (userOnly) {
      await fetchUserReviews();
    } else if (movieId) {
      await fetchMovieReviews(movieId);
    } else {
      await fetchAllReviews();
    }
    /*try {
      setLoading(true);
      const data = userOnly
        ? await getUserReviews(user.token)
        : await getMovieReviews(movieId, user?.token);
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }*/


  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    deleteReviewById(id);
    /*try {
      await deleteReview(id, user.token);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Failed to delete review", err);
    }*/
  };

  useEffect(() => {
    fetchReviews();
  }, [movieId, userOnly]);

  if (loading) return <p>Loading reviews...</p>;
  if (!reviews.length) return <p>No reviews yet.</p>;

  return (
    <div className="review-list">
      {reviews.map((r) => (
        <div key={r.id} className="review-card">

          <div className="review-title">
            {/* Show movie title only if not inside a specific movie page */}
            {!movieId && r.movie && (
              <h5>
                <Link to={`/movie/${r.movieid}`}>{r.movie}</Link>
              </h5>
            )}
          </div>

          <div className="review-header">
            <strong>{r.username || user?.username}</strong> ---{" "}
            <span>{new Date(r.created_at).toLocaleString()}</span>
          </div>



          <div className="review-rating">
            {Array.from({ length: 5 }, (_, i) => i < r.rating ? "★" : "☆").join(" ")}
            {/*⭐ {r.rating}/5*/}
          </div>
          <p>{r.review}</p>
          {user?.id === r.userid && (
            <button
              className="delete-btn"
              onClick={() => handleDelete(r.id)}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}