import { useParams, Link } from "react-router-dom";
import { useUser } from "../context/useUser.js";
import { useEffect, useState } from "react";
import { getMovieInfo } from "../services/TMDB.js";
import { useMovie } from "../context/MovieContext.jsx";
import ReviewForm from "./ReviewForm.jsx";
import { useReviews } from "../context/ReviewContext.jsx";
import "./MovieAside.css";

export default function MovieAside({ movieId }) {
    const { id: routeId } = useParams();
    const { addFavorite, removeFavorite, isFavorite, user } = useUser();
    const { selectedMovie } = useMovie();

    const [fetchedMovie, setFetchedMovie] = useState(null);
    const id = Number(movieId || routeId); ///support both props and URL param
    //const favorite = isFavorite(id);
    //const movieId = Number(id);
    //const favorite = isFavorite(movieId);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const { fetchMovieReviews  } = useReviews();

    // Use context movie if available, else fetch
    useEffect(() => {
        if (selectedMovie && selectedMovie.id === id) {
            setFetchedMovie(selectedMovie);
        } else if (id) {
            (async () => {
                const data = await getMovieInfo(id);
                if (data) setFetchedMovie(data);
            })();
        }
    }, [id, selectedMovie]);

    const handleToggleFavorite = () => {
        if (!fetchedMovie) return;
        if (isFavorite(id)) {
            removeFavorite(id);
        } else {
            addFavorite({
                id,
                title: fetchedMovie.title,
            });
        }
    };

    const handleGiveReviw = () => {
        if (!fetchedMovie) return;
        setShowReviewModal(true);
    };

    const handleReviewAdded = async () => {
        try {
            await fetchMovieReviews(id);
        } catch (err) {
            console.error("Failed to refresh reviews", err);
        }
    };



    const favorite = isFavorite(id);

    return (
        <div className="movie-aside">
            <ul>
                <li>
                    {user?.token ? (
                        <button
                            onClick={handleToggleFavorite}
                            className={`aside-btn ${favorite ? "favorited" : ""}`}
                        >
                            {favorite ? "★ Remove from Favorites" : "+ Add to Favorites"}
                        </button>
                    ) : (
                        <p>
                            <Link to="/signin">Sign in</Link> to manage favorites
                        </p>
                    )}
                </li>
                <li>
                    <button
                        onClick={handleGiveReviw}
                        className="aside-btn"
                        disabled={!user?.token}
                    >
                        Give Review
                    </button>
                </li>
                <li>
                    <button className="aside-btn" disabled>
                        Add to Group (coming soon)
                    </button>
                </li>
            </ul>

            {/* Render Review Form */}
            {showReviewModal && fetchedMovie && (
                <ReviewForm
                    movieId={id}
                    movieTitle={fetchedMovie.title}
                    onClose={() => setShowReviewModal(false)}
                    onReviewAdded={handleReviewAdded}

                />
            )}

        </div>
    );
}