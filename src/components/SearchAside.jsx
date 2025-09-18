import { useMovies } from "../context/MovieSearchContext.jsx";

export default function SearchAside() {
    const { query, setQuery, runSearch, queryYear, setQueryYear, runSearchByYear } = useMovies();

    const handleSubmit = (e) => {
        e.preventDefault();
        setQueryYear(null);
        runSearch(query, 1);
    };

    const handleSubmitYear = (e) => {
        e.preventDefault();
        setQuery(null);
        runSearchByYear(queryYear, 1);
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
        </aside>
    );
}