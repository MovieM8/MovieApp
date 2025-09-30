import { Link, useLocation, useParams } from "react-router-dom";
import { useUser } from "../context/useUser.js";
import { useState } from "react";
import AddMovieToGroup from "./AddMovieToGroup.jsx";
import { useGroups } from "../context/GroupContext.jsx";
import "./Moviecards.css";

export default function MovieCards({ movies }) {

    const { user, addFavorite, removeFavorite, isFavorite } = useUser();
    const [selectedMovie, setSelectedMovie] = useState(null);

    const { currentGroup, addMovieToGroupContext } = useGroups();

    const location = useLocation();
    const { groupId } = useParams();

    const isGroupPage = location.pathname.startsWith("/groups/");

    const handleRemoveFromGroup = async (movieId) => {
        if (!user?.token || !currentGroup?.id) return;
        if (!window.confirm("Are you sure you want to remove this movie from the group?")) return;
        // Replace group’s movie with null
        await addMovieToGroupContext(currentGroup.id, null, null);
    };

    return (
        <div className="movies-section">
            <div className="moviegrid">
                {movies.map((movie) => {
                    const favorite = isFavorite(movie.id);
                    return (
                        <div key={movie.id} className="movie-card">
                            <Link
                                to={`/movie/${movie.id}`}
                                state={{ movie }}
                                className="movie-link">
                                {movie.image && <img src={movie.image} alt={movie.title} />}
                                <h4>{movie.title}</h4>
                                <p><strong>Rating:</strong> {movie.rating ? movie.rating.toFixed(1) : "N/A"}</p>
                                <p><strong>Release date:</strong> {movie.release_date}</p>
                                <p><strong>Description:</strong> {movie.overview}</p>
                            </Link>
                            {user?.token && (
                                <div className="movie-actions">
                                    <button
                                        className={`favorite-btn ${isFavorite(movie.id) ? "favorited" : ""}`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent navigation
                                            e.preventDefault(); // prevent link click
                                            favorite
                                                ? removeFavorite(movie.id)
                                                : addFavorite(movie);
                                        }}
                                    >
                                        {favorite ? "★ Favorited" : "+ Favorites"}
                                    </button>


                                    {/* Conditional button */}
                                    {isGroupPage ? (
                                        <button
                                            className="group-btn danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                handleRemoveFromGroup(movie.id);
                                            }}
                                        >
                                            Remove from Group
                                        </button>
                                    ) : (
                                        <button
                                            className="group-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setSelectedMovie(movie);
                                            }}
                                        >
                                            + Add to Group
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>

                    );
                })}

                {selectedMovie && (
                    <AddMovieToGroup
                        movie={selectedMovie}
                        onClose={() => setSelectedMovie(null)}
                    />
                )}
            </div>
        </div>

    )
}