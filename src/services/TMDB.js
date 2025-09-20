import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const searchMovies = async (query, page = 1) => {
    const url = `${BASE_URL}/search/movie`
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
    const url = `${BASE_URL}/discover/movie`
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
    const url = `${BASE_URL}/genre/movie/list?language=en'`
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


export const getMovieDetails = async (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}`;
    try {
        const res = await axios.get(url, {
            params: { language: "en-US", append_to_response: "credits,recommendations" },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        const m = res.data;

        return {
            id: m.id,
            title: m.title,
            original_title: m.original_title,
            genres: m.genres.map((g) => g.name) || [],
            original_language: m.original_language,
            vote_average: m.vote_average ? m.vote_average.toFixed(1) : "N/A",
            overview: m.overview,
            popularity: m.popularity ? m.popularity.toFixed(1) : "N/A",
            status: m.status,
            release_date: m.release_date,
            budget: m.budget,
            image: m.poster_path
                ? `https://image.tmdb.org/t/p/w300${m.poster_path}`
                : null,
            cast: m.credits?.cast?.slice(0, 10).map((c) => ({
                id: c.id,
                name: c.name,
                character: c.character,
                profile: c.profile_path
                    ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
                    : null,
            })) || [],
            recommendations: m.recommendations?.results?.slice(0, 8).map((rec) => ({
                id: rec.id,
                title: rec.title,
                image: rec.poster_path
                    ? `https://image.tmdb.org/t/p/w200${rec.poster_path}`
                    : null,
            })) || [],
        };
    } catch (err) {
        console.error("Failed to get movie details:", err);
        return null;
    }
};

export const getMovieInfo = async (movieId) => {
    const url = `${BASE_URL}/movie/${movieId}`;
    try {
        const res = await axios.get(url, {
            params: { language: "en-US" },
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });

        const m = res.data;

        if (!m) return null;

        return {
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
        };
    } catch (err) {
        console.error("Failed to get movie info:", err);
        return null;
    }
};