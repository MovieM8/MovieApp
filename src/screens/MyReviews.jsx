import ReviewList from "../components/ReviewList.jsx";

export default function MyMovieReviews() {

    return (
        <div className="moviereviews">
            <h2>My Movie Reviews</h2>
            <ReviewList userOnly = {true} />
        </div>
    );

}