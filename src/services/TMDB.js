import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3/';

export const searchMovies = async (query, page = 1) => {
    //const url = `${BASE_URL}/search/movie movie?query=${query}&include_adult=false&language=en-US&page=${page}`
    const url =`${BASE_URL}/search/movie`
    try {
        //const res = await axios.get(`${BASE_URL}/search/movie?query=&include_adult=false&language=en-US&page=1`, {
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
            totalPages: res.data.total_pages,
            currentPage: res.data.page,
        };
    } catch (err) {
        console.error("Failed to search movies:", err);
        return { movies: [], totalPages: 0, currentPage: 1 };
    }
};
