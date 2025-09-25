import React, { useState, useEffect } from "react";
import MovieCards from "../components/Moviecards.jsx"
import { getMovieInfo } from "../services/TMDB.js"
import { useUser } from "../context/useUser.js";

export default function Favorites() {
    const { favorites, loadFavorites } = useUser();
    const [favmovies, setfavMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load favorites from backend only once
        const fetchFavorites = async () => {
            setLoading(true);
            await loadFavorites(); // updates context favorites
            setLoading(false);
        };

        fetchFavorites();
    }, []); // runs only once

    useEffect(() => {
        // Fetch full movie info whenever favorites change
        const fetchMovieDetails = async () => {
            if (favorites.length === 0) {
                setfavMovies([]);
                return;
            }

            const movieDetails = await Promise.all(
                favorites.map(async (fav) => await getMovieInfo(fav.movieid))
            );

            setfavMovies(movieDetails.filter(Boolean)); // filter out null values
        };

        fetchMovieDetails();
    }, [favorites]); // only runs when favorites array changes

    if (loading) return <p>Loading favorite movies...</p>;

    return (
        <div className="favorites-container">
            {favmovies.length === 0 ? (
                <p>No favorite movies found.</p>
            ) : (
                <MovieCards movies={favmovies} />
            )}
        </div>
    );
}