import { Link, useLocation } from "react-router-dom"

export default function ProfileAside() {
    const location = useLocation();
    const isMyProfile = location.pathname.endsWith("/myprofile");
    const isMyFavorite = location.pathname.endsWith("/favorites");

    return (
        <ul>
            <li><Link to="/myprofile">My Profile</Link></li>
            <li><Link to="/myprofile/favorites">My Favorites</Link></li>
            <li><Link to="/myprofile/myreviews">My Reviews</Link></li>
            <li><Link to="/myprofile/mygroups">My Groups</Link></li>
            {isMyProfile && (
                <li><Link to="/myprofile/deleteaccount">Delete Account</Link></li>
            )}
            {isMyFavorite && (
                <p>Placeholder for share link</p>
            )}
        </ul>
    );
}