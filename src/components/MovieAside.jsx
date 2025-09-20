import { useParams, Link } from "react-router-dom";
import { useUser } from "../context/useUser.js";
import { useEffect, useState } from "react";
import { getMovieInfo } from "../services/TMDB.js";
import "./MovieAside.css";

export default function MovieAside({ movie, movieId }) {
    //const { id } = useParams();
    const { addFavorite, removeFavorite, isFavorite, user } = useUser();

    const [fetchedMovie, setFetchedMovie] = useState(movie || null);
    const id = Number(movieId);
    //const favorite = isFavorite(id);
    //const movieId = Number(id);
    //const favorite = isFavorite(movieId);

    useEffect(() => {
        // If no movie data is passed, fetch it
        if (!movie && movieId) {
            (async () => {
                const data = await getMovieInfo(movieId);
                if (data) setFetchedMovie(data);
            })();
        }
    }, [movie, movieId]);

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
                    <button className="aside-btn" disabled>
                        Give Review (coming soon)
                    </button>
                </li>
                <li>
                    <button className="aside-btn" disabled>
                        Add to Group (coming soon)
                    </button>
                </li>
            </ul>
        </div>
    );
}