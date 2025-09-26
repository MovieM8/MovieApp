import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupContext.jsx";
import { useUser } from "../context/useUser.js";
import CreateGroupForm from "../components/CreateGroup.jsx";
import "./GroupListing.css";

export default function GroupListing() {
    const { groups, fetchGroups } = useGroups();
    const { user } = useUser();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGroups = async () => {
            setLoading(true);
            await fetchGroups();
            setLoading(false);
        };
        loadGroups();
    }, []);

    const handleGroupCreated = async () => {
        await fetchGroups();
        setShowCreateModal(false);
    };

    const handleCreateClick = () => {
        if (!user?.token) {
            // Redirect to signin if not logged in
            navigate("/signin");
        } else {
            setShowCreateModal(true);
        }
    };

    if (loading) return <p>Loading groups...</p>;

    return (
        <div className="groups-page">
            <div className="groups-header">
                <h2>All Groups</h2>
                <button
                    className="create-group-btn"
                    onClick={handleCreateClick}
                >
                    {user?.token ? "Create New Group" : "Sign in to Create Group"}
                </button>
            </div>

            {groups.length === 0 ? (
                <p>No groups available.</p>
            ) : (
                <ul className="groups-list">
                    {groups.map((group) => (
                        <li key={group.id}>
                            <a href={`/groups/${group.id}`}>{group.groupname}</a> (Owner: {group.owner})
                        </li>
                    ))}
                </ul>
            )}

            {showCreateModal && (
                <CreateGroupForm
                    onClose={() => setShowCreateModal(false)}
                    onGroupCreated={handleGroupCreated}
                />
            )}
        </div>
    );
}
