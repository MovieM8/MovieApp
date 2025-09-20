import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails } from "../services/TMDB.js";
import "./MoviePage.css";

export default function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await getMovieDetails(id);
            setMovie(data);
            setLoading(false);
        };
        fetchData();
    }, [id]);

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
        </div>
    );
}