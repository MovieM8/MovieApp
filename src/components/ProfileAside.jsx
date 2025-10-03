import { Link, useLocation } from "react-router-dom"
import { useUser } from "../context/useUser.js";
import "./ProfileAside.css";

export default function ProfileAside() {
    const location = useLocation();
    const isMyProfile = location.pathname.endsWith("/myprofile");
    const isMyFavorite = location.pathname.endsWith("/favorites");

    const { sharelink, createSharelink, removeSharelink } = useUser();
    const shareStart ="/shared/favorites/"

    const handleCopy = () => {
        if (!sharelink) return;
        navigator.clipboard.writeText(window.location.origin + shareStart + sharelink);
        alert("Link copied to clipboard!");
    };

    return (
        <ul className="profile-aside">
            <li><Link to="/myprofile">My Profile</Link></li>
            <li><Link to="/myprofile/favorites">My Favorites</Link></li>
            <li><Link to="/myprofile/myreviews">My Reviews</Link></li>
            <li><Link to="/myprofile/mygroups">My Groups</Link></li>
            {isMyProfile && (
                <li><Link to="/myprofile/deleteaccount">Delete Account</Link></li>
            )}
            {isMyFavorite && (
                <li className="sharelink-section">
                    {!sharelink ? (
                        <button className="share-btn" onClick={createSharelink}>
                            Create Sharelink
                        </button>
                    ) : (
                        <div className="sharelink-container">
                            <input
                                type="text"
                                value={window.location.origin + shareStart + sharelink}
                                readOnly
                                onClick={handleCopy}
                                className="sharelink-input"
                            />
                            <div className="sharelink-actions">
                                <button className="copy-btn" onClick={handleCopy}>Copy</button>
                                <button className="remove-btn" onClick={removeSharelink}>Remove</button>
                            </div>
                        </div>
                    )}
                </li>
            )}
        </ul>
    );
}