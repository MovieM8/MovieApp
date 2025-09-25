import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieCards from "../components/Moviecards.jsx";
import { getMovieInfo } from "../services/TMDB.js";
import { getFavoritesBySharelink } from "../services/favoriteshare.js";

export default function SharedFavorites() {
    const { sharelink } = useParams(); // expects /shared/favorites/:sharelink
    const [favMovies, setFavMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSharedFavorites = async () => {
            if (!sharelink) return;
            setLoading(true);
            try {
                const sharedFavorites = await getFavoritesBySharelink(sharelink);
                if (!sharedFavorites || sharedFavorites.length === 0) {
                    setFavMovies([]);
                    setLoading(false);
                    return;
                }
                
                // Fetch full movie info
                const movieDetails = await Promise.all(
                    sharedFavorites.map(async (fav) => await getMovieInfo(fav.movieid))
                );

                setFavMovies(movieDetails.filter(Boolean));
            } catch (err) {
                console.error("Failed to load shared favorites:", err);
                setFavMovies([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSharedFavorites();
    }, [sharelink]);

    if (loading) return <p>Loading shared favorite movies...</p>;

    return (
        <div className="favorites-container">
            {favMovies.length === 0 ? (
                <p>No shared favorites found.</p>
            ) : (
                <MovieCards movies={favMovies} />
            )}
        </div>
    );
}