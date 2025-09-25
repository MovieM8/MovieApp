import { Link, useLocation } from "react-router-dom"
import { useEffect, useState } from "react";
import { useUser } from "../context/useUser.js";
import { getSharelink, saveSharelink, deleteSharelink, } from "../services/favoriteshare.js";
import "./ProfileAside.css";

export default function ProfileAside() {
    const location = useLocation();
    const isMyProfile = location.pathname.endsWith("/myprofile");
    const isMyFavorite = location.pathname.endsWith("/favorites");

    const { user } = useUser();
    const [sharelink, setSharelink] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch existing sharelink when on favorites
    useEffect(() => {
        if (isMyFavorite && user?.token) {
            (async () => {
                const existing = await getSharelink(user.token);
                if (existing?.sharelink) {
                    setSharelink(existing.sharelink);
                }
            })();
        }
    }, [isMyFavorite, user]);

    // Generate a new random 8-digit number
    const generateRandomId = () => {
        return Math.floor(10000000 + Math.random() * 90000000).toString();
    };

    const handleCreate = async () => {
        if (!user?.token || !user?.username) return;
        setLoading(true);
        try {
            const newSharelink = `/shared/favorites/${generateRandomId()}/${user.username}`;
            const saved = await saveSharelink(newSharelink, user.token);
            if (saved?.sharelink) {
                setSharelink(saved.sharelink);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!user?.token) return;
        setLoading(true);
        try {
            await deleteSharelink(user.token);
            setSharelink(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!sharelink) return;
        navigator.clipboard.writeText(window.location.origin + sharelink);
        alert("Link copied to clipboard!");
    };

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
                <li className="sharelink-section">
                    {!sharelink ? (
                        <button
                            className="share-btn"
                            onClick={handleCreate}
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Sharelink"}
                        </button>
                    ) : (
                        <div className="sharelink-container">
                            <input
                                type="text"
                                value={window.location.origin + sharelink}
                                readOnly
                                className="sharelink-input"
                                onClick={handleCopy}
                            />
                            <div className="sharelink-actions">
                                <button className="copy-btn" onClick={handleCopy}>
                                    Copy
                                </button>
                                <button
                                    className="remove-btn"
                                    onClick={handleDelete}
                                    disabled={loading}
                                >
                                    {loading ? "Removing..." : "Remove"}
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            )}
        </ul>
    );
}