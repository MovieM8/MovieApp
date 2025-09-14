import { Link, useLocation } from "react-router-dom";
import "./Aside.css";

export default function Aside() {
    const location = useLocation();

    // Define content for different pages
    const renderAsideContent = () => {
        switch (location.pathname) {
            case "/myprofile":
                return (
                    <ul>
                        <li><Link to="/favorites">My Favorites</Link></li>
                        <li><Link to="/myreviews">My Reviews</Link></li>
                        <li><Link to="/mygroups">My Groups</Link></li>
                        <li><Link to="/deleteaccount">Delete Account</Link></li>
                    </ul>
                );
            case "/favorites":
                return <p>Manage your favorite movies here.</p>;
            case "/myreviews":
                return <p>View and manage your reviews here.</p>;
            case "/mygroups":
                return <p>Manage your groups here.</p>;
            default:
                return <p>Select an option from the menu.</p>;
        }
    };

    return (
        <aside className="aside-container">
            <h3>Menu</h3>
            {renderAsideContent()}
        </aside>
    );
}