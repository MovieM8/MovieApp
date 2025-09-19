import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, page = 1) => {
    const url =`${BASE_URL}/search/movie`
    try {
        const res = await axios.get(url, {
            params: {
                query,
                include_adult: false,
                language: "en-US",
                page,
            },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        let movies = res.data.results;
        if (!Array.isArray(movies)) movies = [movies];

        return {
            movies: movies.map((m) => ({
                id: m.id,
                title: m.title,
                original_title: m.original_title,
                release_date: m.release_date,
                overview: m.overview,
                popularity: m.popularity,
                rating: m.vote_average,
                image: m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : null,
            })),
            totalPages: Math.min(res.data.total_pages, 500),
            currentPage: res.data.page,
        };
    } catch (err) {
        console.error("Failed to search movies:", err);
        return { movies: [], totalPages: 0, currentPage: 1 };
    }
};

export const searchMoviesByYear = async (queryYear, page = 1) => {
    const url =`${BASE_URL}/discover/movie`
    try {
        const res = await axios.get(url, {
            params: {
                primary_release_year: queryYear,
                page,
            },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        let movies = res.data.results;
        if (!Array.isArray(movies)) movies = [movies];

        return {
            movies: movies.map((m) => ({
                id: m.id,
                title: m.title,
                original_title: m.original_title,
                release_date: m.release_date,
                overview: m.overview,
                popularity: m.popularity,
                rating: m.vote_average,
                image: m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : null,
            })),
            totalPages: Math.min(res.data.total_pages, 500),
            currentPage: res.data.page,
        };
    } catch (err) {
        console.error("Failed to search movies by year:", err);
        return { movies: [], totalPages: 0, currentPage: 1 };
    }
};

export const getGenres = async () => {
    const url =`${BASE_URL}/genre/movie/list?language=en'`
    try {
        const res = await axios.get(url, {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        let genres = res.data.genres || [];

        return {
            genres: genres.map((g) => ({
                id: g.id,
                name: g.name,
            })),
        };
    } catch (err) {
        console.error("Failed get the genres:", err);
        return { genres: [] };
    }
};

export const searchMoviesByGenre = async (genreIds, page = 1) => {
    const url = `${BASE_URL}/discover/movie`;
    try {
        const res = await axios.get(url, {
            params: {
                with_genres: genreIds.join(","), // array => string
                language: "en-US",
                page,
            },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        let movies = res.data.results || [];

        return {
            movies: movies.map((m) => ({
                id: m.id,
                title: m.title,
                original_title: m.original_title,
                release_date: m.release_date,
                overview: m.overview,
                popularity: m.popularity,
                rating: m.vote_average,
                image: m.poster_path
                    ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                    : null,
            })),
            totalPages: Math.min(res.data.total_pages, 500),
            currentPage: res.data.page,
        };
    } catch (err) {
        console.error("Failed to search movies by genre:", err);
        return { movies: [], totalPages: 0, currentPage: 1 };
    }
};