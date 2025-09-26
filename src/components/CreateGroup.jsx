import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupContext.jsx";
import { useUser } from "../context/useUser.js";
import "./CreateGroup.css";

export default function CreateGroupForm({ onClose, onGroupCreated }) {
    const { createNewGroup } = useGroups();
    const { user } = useUser();
    const navigate = useNavigate();

    const [groupName, setGroupName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName.trim()) return;
        try {
            setLoading(true);
            await createNewGroup(groupName.trim());
            setGroupName("");
            if (onGroupCreated) await onGroupCreated(); // refresh group list
            if (onClose) onClose(); // close modal if provided
        } catch (err) {
            console.error("Failed to create group", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSignIn = () => {
        navigate("/signin");
    };

    return (
        <div className="create-group-modal-overlay">
            <div className="create-group-modal">
                {user?.token ? (
                    <>
                        <h3>Create a New Group</h3>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Group Name:
                                <input
                                    type="text"
                                    value={groupName}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    placeholder="Enter group name"
                                    required
                                />
                            </label>
                            <div className="form-actions">
                                <button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create"}
                                </button>
                                {onClose && (
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="cancel-btn"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="signin-prompt">
                        <p>You must be signed in to create a group.</p>
                        <button onClick={handleSignIn}>Sign in</button>
                    </div>
                )}
            </div>
        </div>
    );
}
