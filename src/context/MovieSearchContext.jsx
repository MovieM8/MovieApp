import { createContext, useContext, useState } from "react";
import { searchMovies } from "../services/TMDB.js";
import { searchMoviesByYear } from "../services/TMDB.js";

const MovieContext = createContext();

export function MovieSearchProvider({ children }) {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [queryYear, setQueryYear] = useState("");

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

    return (
        <MovieContext.Provider
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
            }}
        >
            {children}
        </MovieContext.Provider>
    );
}

export function useMovies() {
    return useContext(MovieContext);
}