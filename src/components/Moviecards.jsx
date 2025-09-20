import { useUser } from "../context/useUser.js";
import "./Moviecards.css";

export default function MovieCards({ movies }) {

    const { user, addFavorite, removeFavorite, isFavorite } = useUser();

    return (
        <div className="moviegrid">
            {movies.map((movie) => {
                const favorite = isFavorite(movie.id);

                return (
                    <div key={movie.id} className="movie-card">
                        {movie.image && <img src={movie.image} alt={movie.title} />}
                        <h4>{movie.title}</h4>
                        <p><strong>Rating:</strong> {movie.rating ? movie.rating.toFixed(1) : "N/A"}</p>
                        <p><strong>Release date:</strong> {movie.release_date}</p>
                        <p><strong>Description:</strong> {movie.overview}</p>

                        {user?.token && (
                            <button
                                className={`favorite-btn ${isFavorite(movie.id) ? "favorited" : ""}`}
                                onClick={() =>
                                    favorite
                                        ? removeFavorite(movie.id)
                                        : addFavorite(movie)
                                }
                            >
                                {favorite ? "★ Favorited" : "+ Favorites"}
                            </button>
                        )}
                    </div>
                );
            })}
        </div>

    )
}