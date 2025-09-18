import { useMovies } from "../context/MovieSearchContext.jsx";
import ReactPaginate from "react-paginate";
import "./Search.css";

export default function Search() {
    const { movies, loading, pageCount, runSearch, query, currentPage, queryYear, runSearchByYear } = useMovies();

    const handlePageClick = (event) => {
        if(query != null){
            runSearch(query, event.selected + 1);
        }
        else if (queryYear != null) {
            runSearchByYear(queryYear, event.selected + 1)
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
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
                    {pageCount > 1 && (
                        <ReactPaginate
                            breakLabel="..."
                            nextLabel=">"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            pageCount={pageCount}
                            previousLabel="<"
                            renderOnZeroPageCount={null}
                            containerClassName="pagination pagination-top"
                            activeClassName="selected"
                            forcePage={currentPage - 1}
                        />
                    )}

                    <div className="moviegrid">
                        {movies.map((movie) => (
                            <div key={movie.id}>
                                {movie.image && (
                                    <img
                                        src={movie.image}
                                        alt={movie.title}
                                    />
                                )}
                                <h4>{movie.title}</h4>
                                <p><strong>Rating:</strong> {movie.rating ? movie.rating.toFixed(1) : "N/A"}</p>
                                <p><strong>Release date:</strong> {movie.release_date}</p>
                                <p><strong>Description:</strong> {movie.overview}</p>
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
                            containerClassName="pagination pagination-bottom"
                            activeClassName="selected"
                            forcePage={currentPage - 1}
                        />
                    )}
                </>
            )}
        </div>
    );
}