import { useMovies } from "../context/MovieContext.jsx";

export default function SearchAside() {
    const { query, setQuery, runSearch } = useMovies();

    const handleSubmit = (e) => {
        e.preventDefault();
        runSearch(query, 1);
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
                    placeholder="Enter movie title..."
                />
                <button type="submit">Search</button>
            </form>
        </aside>
    );
}