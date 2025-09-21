import { Link, useLocation, useParams} from "react-router-dom"
import "./Aside.css";
import ScreeningTimeMenu from "./ScreeningAside.jsx"
import SearchAside from "./SearchAside.jsx"
import MovieAside from "./MovieAside.jsx";

export default function Aside() {
    const location = useLocation();
    const params = useParams();
    const isMyProfileSection = location.pathname.startsWith("/myprofile");
    const isMoviePage = location.pathname.startsWith("/movie");

    const movieFromState = location.state?.movie;

    // Define content for different pages
    const renderAsideContent = () => {
        if (isMyProfileSection) {
            return (
                <ul>
                    <li><Link to="/myprofile/favorites">My Favorites</Link></li>
                    <li><Link to="/myprofile/myreviews">My Reviews</Link></li>
                    <li><Link to="/myprofile/mygroups">My Groups</Link></li>
                    <li><Link to="/myprofile/deleteaccount">Delete Account</Link></li>
                </ul>
            )
        } else if (isMoviePage) {
            return <MovieAside movieId={params.id} />;
        } else {
            switch (location.pathname) {
                case "/screeningtimes":
                    return <ScreeningTimeMenu />;
                case "/favorites":
                    return <p>Manage your favorite movies here.</p>;
                case "/myreviews":
                    return <p>View and manage your reviews here.</p>;
                case "/mygroups":
                    return <p>Manage your groups here.</p>;
                case "/search":
                    return <SearchAside />;
                default:
                    return <p>Select an option from the menu.</p>;
            }
        }
    };

    return (
        <aside className="aside-container">
            <h3>Menu</h3>
            {renderAsideContent()}
        </aside>
    );
}