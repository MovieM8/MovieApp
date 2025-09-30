import { useEffect, useState } from "react";
import { useGroups } from "../context/GroupContext.jsx";
import { useUser } from "../context/useUser.js";
import { useNavigate } from "react-router-dom";
import "./AddMovieToGroup.css"; //same modal styles

export default function AddScreeningToGroup({ screening, onClose }) {
    const { user } = useUser();
    const { fetchMyGroups, groups, addScreeningToGroupContext } = useGroups();
    const [selectedGroup, setSelectedGroup] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.token) {
            fetchMyGroups();
        }
    }, [user]);

    const handleSubmit = async () => {
        if (!selectedGroup) return;

        await addScreeningToGroupContext(selectedGroup, screening);
        setToastMessage(`✅ Screening of "${screening.title}" added to group.`);

        /*setTimeout(() => {
            setToastMessage("");
            onClose();
        }, 2000);*/
        onClose();
    };

    // Not logged in
    if (!user?.token) {
        return (
            <div className="dialog-backdrop">
                <div className="dialog">
                    <h3>Sign in Required</h3>
                    <p>You must sign in to add this screening to a group.</p>
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
        <>
            {toastMessage && <div className="toast">{toastMessage}</div>}

            <div className="add-dialog-backdrop">
                <div className="dialog">
                    <h3>Add Screening of "{screening.title}" to Group</h3>

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
                            Add
                        </button>
                        <button onClick={onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
}