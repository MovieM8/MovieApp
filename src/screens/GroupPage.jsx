import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGroups } from "../context/GroupContext.jsx";
import { useUser } from "../context/useUser.js";
import MovieCards from "../components/Moviecards.jsx"
import "./GroupPage.css";

export default function GroupPage() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const {
        currentGroup,
        fetchGroupDetails,
        requestToJoinGroup,
        removeMemberFromGroup,
        addMovieToGroupContext,
        addScreeningToGroupContext,
        membershipStatus,
        fetchMembershipStatus,
        loading,
        groupMembers,
        fetchGroupMembers,
        movies,
        decideJoinRequest,
        deleteGroupById,
    } = useGroups();

    const [movieInput, setMovieInput] = useState("");
    const [screenTimeInput, setScreenTimeInput] = useState("");
    const [groupVisible, setGroupVisible] = useState(false);

    const [hoveredUserId, setHoveredUserId] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // track which member action is loading
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Load group membership on mount
    useEffect(() => {
        const loadGroup = async () => {
            const status = await fetchMembershipStatus(groupId);
            // Only fetch full group details if user is approved member
            if (status === "member") {
                await fetchGroupDetails(groupId);
                await fetchGroupMembers(groupId);
                setGroupVisible(true);
            } else {
                setGroupVisible(false);
            }
        };
        loadGroup();
    }, [groupId, user]);

    const handleRequestJoin = async () => {
        if (!user?.token) return;
        await requestToJoinGroup(groupId);
        await fetchMembershipStatus(groupId);
    };

    const handleCancelRequest = async () => {
        if (!user?.token) return;
        await removeMemberFromGroup(groupId, user.id);
        await fetchMembershipStatus(groupId);
    };

    const handleAddMovie = async (e) => {
        e.preventDefault();
        if (!movieInput.trim()) return;
        await addMovieToGroupContext(groupId, null, movieInput.trim()); // null for tmdbid
        setMovieInput("");
        await fetchGroupDetails(groupId); // refresh after adding
    };

    const handleAddScreening = async (e) => {
        e.preventDefault();
        if (!screenTimeInput.trim()) return;
        await addScreeningToGroupContext(groupId, screenTimeInput.trim());
        setScreenTimeInput("");
        await fetchGroupDetails(groupId); // refresh after adding
    };

    const handleRemove = async (memberId) => {
        setActionLoading(memberId);
        await removeMemberFromGroup(groupId, memberId);
        await fetchGroupMembers(groupId);

        if (!(memberId == currentGroup?.groupowner)) {
            const loadGroup = async () => {
                await fetchMembershipStatus(groupId);
                setGroupVisible(false);
            };
            loadGroup();
        }
        setActionLoading(null);
    };

    const handleAccept = async (memberId) => {
        setActionLoading(memberId);
        await decideJoinRequest(groupId, memberId, true);
        await fetchGroupMembers(groupId);
        setActionLoading(null);
    };

    const handleReject = async (memberId) => {
        setActionLoading(memberId);
        await decideJoinRequest(groupId, memberId, false);
        await fetchGroupMembers(groupId);
        setActionLoading(null);
    };

    const handleDeleteGroup = async () => {
        if (window.confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
            setDeleteLoading(true);
            await deleteGroupById(groupId);
            setDeleteLoading(false);
            navigate("/groups");
        }
    };

    const isLoggedIn = !!user?.token;
    const isOwner = groupMembers.find((m) => m.user_id === user?.id)?.role === "owner";

    if (loading) return <p>Loading group...</p>;
    return (
        <div className="group-page">
            {/*<h2>Group Details</h2>*/}

            {!isLoggedIn && (
                <div>
                    <p>You must sign in to request membership or customize the group.</p>
                    <button onClick={() => navigate("/signin")}>Sign In</button>
                </div>
            )}

            {isLoggedIn && membershipStatus === "none" && (
                <button onClick={handleRequestJoin}>Request to Join</button>
            )}

            {isLoggedIn && membershipStatus === "pending" && (
                <button onClick={handleCancelRequest}>Cancel Join Request</button>
            )}

            {membershipStatus === "member" && groupVisible && currentGroup && (
                <div className="group-member-section">
                    <h2>{currentGroup.groupname}</h2>
                    {/*<p>Owner: {currentGroup.owner}</p>*/}

                    {/*<h3>Add Movie</h3>
                    <form onSubmit={handleAddMovie}>
                        <input
                            type="text"
                            value={movieInput}
                            onChange={(e) => setMovieInput(e.target.value)}
                            placeholder="Enter movie name"
                            required
                        />
                        <button type="submit">Add Movie</button>
                    </form>

                    <h3>Add Screening Time</h3>
                    <form onSubmit={handleAddScreening}>
                        <input
                            type="text"
                            value={screenTimeInput}
                            onChange={(e) => setScreenTimeInput(e.target.value)}
                            placeholder="Enter screening time"
                            required
                        />
                        <button type="submit">Add Screening</button>
                    </form>*/}

                    <div className="groupMovie">
                        <h3>Group Movie</h3>
                        {movies.length === 0 ? (
                            <p>No movie is set for the group currently.</p>
                        ) : (
                            <div className="groupMovieCard">
                                <MovieCards movies={movies} />
                            </div>
                        )}
                    </div>

                    <div className="groupTimes">
                        <h3>Screening Times</h3>
                        <ul>
                            {currentGroup.groupScreenings?.map((s, idx) => (
                                <li key={idx}>{s.screentime}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="groupMemb">
                        <h3>Group Members</h3>
                        <ul>
                            {groupMembers
                                .slice() // copy to avoid mutating state
                                .sort((a, b) => {
                                    if (a.role === "owner") return -1; // owner first
                                    if (b.role === "owner") return 1;
                                    if (a.role === "pending" && b.role !== "pending") return 1; // pending last
                                    if (b.role === "pending" && a.role !== "pending") return -1;
                                    return a.username.localeCompare(b.username); // alphabetical for members
                                })
                                .map((member) => {
                                    let suffix = "";
                                    if (member.role === "owner") suffix = " (Owner)";
                                    else if (member.role === "pending") suffix = " (Wants to join)";
                                    return (
                                        <li
                                            key={member.user_id}
                                            onMouseEnter={() => setHoveredUserId(member.user_id)}
                                            onMouseLeave={() => setHoveredUserId(null)}
                                            className="member-item"
                                        >
                                            <span>{member.username}{suffix}</span>
                                            {hoveredUserId === member.user_id && (
                                                <div className="member-actions">
                                                    {isOwner && member.role === "member" && member.user_id !== user?.id && (
                                                        <button
                                                            className="btn-danger"
                                                            onClick={() => handleRemove(member.user_id)}
                                                            disabled={actionLoading === member.user_id}
                                                        >
                                                            {actionLoading === member.user_id ? "Removing..." : "Remove"}
                                                        </button>
                                                    )}
                                                    {member.user_id === user?.id && member.role === "member" && (
                                                        <button
                                                            className="btn-danger"
                                                            onClick={() => handleRemove(member.user_id)}
                                                            disabled={actionLoading === member.user_id}
                                                        >
                                                            {actionLoading === member.user_id ? "Leaving..." : "Leave"}
                                                        </button>
                                                    )}
                                                    {isOwner && member.role === "pending" && (
                                                        <>
                                                            <button
                                                                className="btn-success"
                                                                onClick={() => handleAccept(member.user_id)}
                                                                disabled={actionLoading === member.user_id}
                                                            >
                                                                {actionLoading === member.user_id ? "Accepting..." : "Accept"}
                                                            </button>
                                                            <button
                                                                className="btn-danger"
                                                                onClick={() => handleReject(member.user_id)}
                                                                disabled={actionLoading === member.user_id}
                                                            >
                                                                {actionLoading === member.user_id ? "Rejecting..." : "Reject"}
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>

                    {isOwner && (
                        <div className="delete-group">
                            <button
                                className="btn-danger"
                                onClick={handleDeleteGroup}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Delete Group"}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {membershipStatus !== "member" && groupVisible === false && (
                <p>You must be approved to see group details.</p>
            )}
        </div>
    );
}
