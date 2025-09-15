import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchTheatres } from "../services/Finnkino.js";
import { useTheatre } from "../context/TheatreContext.jsx";
import "./Aside.css";

export default function Aside() {
    const location = useLocation();
    const isMyProfileSection = location.pathname.startsWith("/myprofile");
    const [theatres, setTheatres] = useState([]);
    const { selectedTheatre, setSelectedTheatre } = useTheatre();

    useEffect(() => {
        const loadTheatres = async () => {
            const data = await fetchTheatres();
            setTheatres(data);
        };
        loadTheatres();
    }, []);

    const handleChange = (e) => {
        setSelectedTheatre(e.target.value);
    };

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
        }
        else {
            switch (location.pathname) {
                case "/screeningtimes":
                    return (
                        <div>
                            <label htmlFor="theatreSelect">Choose a theatre:</label>
                            <select
                                id="theatreSelect"
                                value={selectedTheatre}
                                onChange={handleChange}
                            >
                                <option value="">-- Select --</option>
                                {theatres.map((theatre) => (
                                    <option key={theatre.id} value={theatre.id}>
                                        {theatre.name}
                                    </option>
                                ))}
                            </select>
                            <p>Movies for the next week are shown.</p>
                        </div>
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
        }
    };

    return (
        <aside className="aside-container">
            <h3>Menu</h3>
            {renderAsideContent()}
        </aside>
    );
}