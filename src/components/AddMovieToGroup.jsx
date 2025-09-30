import { useEffect, useState } from "react";
import { useGroups } from "../context/GroupContext.jsx";
import { useUser } from "../context/useUser.js";
import { useNavigate } from "react-router-dom";
import "./AddMovieToGroup.css";

export default function AddMovieToGroup({ movie, onClose }) {
    const { user } = useUser();
    const { fetchMyGroups, groups, addMovieToGroupContext } = useGroups();
    const [selectedGroup, setSelectedGroup] = useState("");
    const [confirming, setConfirming] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.token) {
            fetchMyGroups();
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!selectedGroup) return;
        if (!confirming) {
            setConfirming(true);
            return;
        }

        await addMovieToGroupContext(selectedGroup, movie.id, movie.title);

        setToastMessage(`✅ "${movie.title}" was added to the group successfully.`);
        setTimeout(() => {
            setToastMessage("");
            onClose();
        }, 2000);
    };

    // Not logged in case
    if (!user?.token) {
        return (
            <div className="dialog-backdrop">
                <div className="dialog">
                    <h3>Sign in Required</h3>
                    <p>You must sign in to add this movie to a group.</p>
                    <div className="dialog-actions">
                        <button onClick={onClose}>Cancel</button>
                        <button
                            className="primary"
                            onClick={() => {
                                onClose();
                                navigate("/signin");
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Logged in form
    return (
        <div className="add-dialog-backdrop">
            <div className="dialog">
                <h3>Add "{movie.title}" to Group</h3>

                {toastMessage && <div className="toast">{toastMessage}</div>}

                {!confirming ? (
                    <>
                        <label>
                            Choose Group:
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                            >
                                <option value="">-- Select a group --</option>
                                {groups.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.groupname}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <div className="dialog-actions">
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedGroup}
                                className="primary"
                            >
                                Continue
                            </button>
                            <button onClick={onClose}>Cancel</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>
                            ⚠️ Adding this movie will{" "}
                            <strong>replace the current movie</strong> in the selected group.
                            Are you sure you want to continue?
                        </p>
                        <div className="dialog-actions">
                            <button onClick={() => setConfirming(false)}>Back</button>
                            <button onClick={handleSubmit} className="danger">
                                Yes, Replace
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
