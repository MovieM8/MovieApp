import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/TMDB.js";
import { useMovie } from "../context/MovieContext.jsx"
import "./MoviePage.css";
import ReviewList from "../components/ReviewList.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import { useReviews } from "../context/ReviewContext.jsx";

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { setSelectedMovie } = useMovie();
    const [showForm, setShowForm] = useState(false);

    const { reviews, fetchMovieReviews } = useReviews();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getMovieDetails(id);
            setMovie(data);
            setSelectedMovie(data);
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
        };
        fetchData();
    }, [id, setSelectedMovie]);

    const handleReviewAdded = async () => {
        try {
            await fetchMovieReviews(id);
        } catch (err) {
            console.error("Failed to refresh reviews", err);
        }
        
        /*try {
            const data = await getMovieReviews(id); // re-fetch reviews only
            setReviews(data);
        } catch (err) {
            console.error("Failed to refresh reviews", err);
        }*/
    };

    if (loading) return <p>Loading...</p>;
    if (!movie) return <p>Movie not found.</p>;

    return (
        <div className="movie-details">
            <div className="movie-header">
                <div className="movie-poster">
                    {movie.image && <img src={movie.image} alt={movie.title} />}
                </div>
                <div className="movie-info">
                    <h2>{movie.title}</h2>
                    <p><strong>Original Title:</strong> {movie.original_title}</p>
                    <p><strong>Genres:</strong> {movie.genres.join(", ")}</p>
                    <p><strong>Language:</strong> {movie.original_language}</p>
                    <p><strong>Rating:</strong> {movie.vote_average}</p>
                    <p><strong>Popularity:</strong> {movie.popularity}</p>
                    <p><strong>Status:</strong> {movie.status}</p>
                    <p><strong>Release Date:</strong> {movie.release_date}</p>
                    <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
                    <p><strong>Overview:</strong> {movie.overview}</p>
                </div>
            </div>

            <h3>Cast</h3>
            <div className="cast-grid">
                {movie.cast.map((c) => (
                    <div key={c.id}>
                        {c.profile && <img src={c.profile} alt={c.name} />}
                        <p>{c.name}</p>
                        <small>as {c.character}</small>
                    </div>
                ))}
            </div>

            <h3>Recommendations</h3>
            <div className="recommendations">
                {movie.recommendations.map((rec) => (
                    <Link key={rec.id} to={`/movie/${rec.id}`}>
                        {rec.image && <img src={rec.image} alt={rec.title} />}
                        <p>{rec.title}</p>
                    </Link>
                ))}
            </div>

            <div className="moviereviews">
                <button className="ReviewAreaGiveReview" onClick={() => setShowForm(true)}>Give Review</button>

                <h3>Reviews</h3>
                <ReviewList movieId={movie.id} />

                {showForm && (
                    <ReviewForm
                        movieId={movie.id}
                        movieTitle={movie.title}
                        onClose={() => setShowForm(false)}
                        onReviewAdded={handleReviewAdded} // refresh reviews
                    />
                )}
            </div>
        </div>
    );
}