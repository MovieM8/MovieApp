import { useMovies } from "../context/MovieContext.jsx";
import ReactPaginate from "react-paginate";
import "./Search.css";

export default function Search() {
    const { movies, loading, pageCount, runSearch, query } = useMovies();

    const handlePageClick = (event) => {
        runSearch(query, event.selected + 1);
    };

    if (loading) {
        return <p>Loading movies...</p>;
    }

    return (
        <div className="search results">
            {movies.length === 0 ? (
                <p>No movies found. Try searching for something else.</p>
            ) : (
                <>
                    <div className="moviegrid">
                        {movies.map((movie) => (
                            <div key={movie.id}>
                                {movie.poster && (
                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                    />
                                )}
                                <h4>{movie.title}</h4>
                                <p>{movie.release_date}</p>
                                <p>{movie.overview}</p>
                            </div>
                        ))}
                    </div>

                    {pageCount > 1 && (
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination"
                            activeClassName="selected"
                        />
                    )}
                </>
            )}
        </div>
    );
}