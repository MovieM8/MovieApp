import { useSearchMovies } from "../context/MovieSearchContext.jsx";
import ReactPaginate from "react-paginate";
import "./Search.css";
import MovieCards from "../components/Moviecards.jsx"

export default function Search() {
    const { movies, loading, pageCount, runSearch, query, currentPage, queryYear, runSearchByYear, runSearchByGenre, selectedGenres } = useSearchMovies();

    const handlePageClick = (event) => {
        if (query != '') {
            runSearch(query, event.selected + 1);
        }
        else if (queryYear != '') {
            runSearchByYear(queryYear, event.selected + 1)
        }
        else if (selectedGenres.length > 0) {
            runSearchByGenre(selectedGenres, event.selected + 1)
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

                    <MovieCards movies={movies} />
                    

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