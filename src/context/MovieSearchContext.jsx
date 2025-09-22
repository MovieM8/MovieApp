import { createContext, useContext, useState } from "react";
import { searchMovies } from "../services/TMDB.js";
import { searchMoviesByYear } from "../services/TMDB.js";
import { getGenres } from "../services/TMDB.js";
import { searchMoviesByGenre } from "../services/TMDB.js";

const MovieSearchContext = createContext();

export function MovieSearchProvider({ children }) {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [queryYear, setQueryYear] = useState("");
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);


    const runSearch = async (searchQuery, page = 1) => {
        if (!searchQuery) return;
        setLoading(true);

        const { movies, totalPages, currentPage } = await searchMovies(searchQuery, page);
        setMovies(movies);
        setPageCount(totalPages);
        setCurrentPage(currentPage);

        setLoading(false);
    };

    const runSearchByYear = async (searchQueryYear, page = 1) => {
        if (!searchQueryYear) return;
        setLoading(true);

        const { movies, totalPages, currentPage } = await searchMoviesByYear(searchQueryYear, page);
        setMovies(movies);
        setPageCount(totalPages);
        setCurrentPage(currentPage);

        setLoading(false);
    };

    const runSearchByGenre = async (genres, page = 1) => {
        if (!genres.length) return;
        setLoading(true);

        const { movies, totalPages, currentPage } = await searchMoviesByGenre(genres, page);
        setMovies(movies);
        setPageCount(totalPages);
        setCurrentPage(currentPage);

        setLoading(false);
    };

    const loadGenres = async () => {
        const { genres } = await getGenres();
        setGenres(genres);
    };

    const runCombinedSearch = async (page = 1) => {
        setLoading(true);

        let movies = [];
        let totalPages = 0;
        let currentPageResult = 1;

        try {
            const params = new URLSearchParams({
                language: "en-US",
                page,
                include_adult: false,
            });

            if (query) params.append("query", query);
            if (queryYear) params.append("primary_release_year", queryYear);
            if (selectedGenres.length > 0) params.append("with_genres", selectedGenres.join(","));

            const url = query
                ? `https://api.themoviedb.org/3/search/movie?${params.toString()}`
                : `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;

            const res = await fetch(url, {
                headers: {
                    accept: "application/json",
                    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
                },
            });

            const data = await res.json();
            movies = data.results || [];
            totalPages = Math.min(data.total_pages, 500);
            currentPageResult = data.page;
        } catch (err) {
            console.error("Failed combined search:", err);
        }

        setMovies(movies);
        setPageCount(totalPages);
        setCurrentPage(currentPageResult);
        setLoading(false);
    };

    return (
        <MovieSearchContext.Provider
            value={{
                query,
                setQuery,
                movies,
                loading,
                pageCount,
                currentPage,
                runSearch,
                queryYear,
                setQueryYear,
                runSearchByYear,
                loadGenres,
                genres,
                selectedGenres,
                setSelectedGenres,
                runSearchByGenre,
                runCombinedSearch, // ✅ added here
            }}
        >
            {children}
        </MovieSearchContext.Provider>
    );
}

export function useSearchMovies() {
    return useContext(MovieSearchContext);
}
