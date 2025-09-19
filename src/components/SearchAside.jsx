import { useSearchMovies } from "../context/MovieSearchContext.jsx";
import { useEffect } from "react";


export default function SearchAside() {
    const { query, setQuery, runSearch, queryYear, setQueryYear, runSearchByYear, loadGenres, genres, selectedGenres, setSelectedGenres, runSearchByGenre } = useSearchMovies();

    // Get the movie genres
    useEffect(() => {
        loadGenres();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setQueryYear('');
        setSelectedGenres([]);
        if (query != '') {
            runSearch(query, 1);
        }
    };

    const handleSubmitYear = (e) => {
        e.preventDefault();
        setQuery('');
        setSelectedGenres([]);
        if (queryYear != '') {
            runSearchByYear(queryYear, 1);
        }
    };

    const handleSubmitGenre = (e) => {
        e.preventDefault();
        setQuery("");
        setQueryYear("");
        if (selectedGenres.length > 0) {
            runSearchByGenre(selectedGenres, 1);
        }
    };

    return (
        <aside className="searchcontainer">
            <form onSubmit={handleSubmit} className="searchform">
                <label htmlFor="searchInput">Search Movies:</label>
                <input
                    id="searchInput"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter search ..."
                />
                <button type="submit">Search</button>
            </form>

            <form onSubmit={handleSubmitYear} className="searchbyyear">
                <label htmlFor="searchInputYear">Search Movies By Year:</label>
                <input
                    id="searchInputYear"
                    type="text"
                    value={queryYear}
                    onChange={(e) => setQueryYear(e.target.value)}
                    placeholder="Enter search year..."
                />
                <button type="submit">Search</button>
            </form>

            <form onSubmit={handleSubmitGenre} className="searchbygenre">
                <label htmlFor="searchInputGenre">Search Movies By Genre:</label>
                <select
                    id="searchInputGenre"
                    value={selectedGenres}
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
                        setSelectedGenres(selected);
                    }}
                    multiple
                >
                    {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                            {genre.name}
                        </option>
                    ))}
                </select>

                <button type="submit">Search</button>
            </form>
        </aside>
    );
}
