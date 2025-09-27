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
    } = useGroups();

    const [movieInput, setMovieInput] = useState("");
    const [screenTimeInput, setScreenTimeInput] = useState("");
    const [groupVisible, setGroupVisible] = useState(false);

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

    const isLoggedIn = !!user?.token;

    if (loading) return <p>Loading group...</p>;

    return (
        <div className="group-page">
            <h2>Group Details</h2>

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
                    <p>Owner: {currentGroup.owner}</p>

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
                                    <li key={member.user_id}>
                                        {member.username}{suffix}
                                    </li>
                                );
                            })}
                    </ul>

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

                    <h3>Group Movie</h3>
                    {console.log(movies)}
                    <MovieCards movies={movies} />
                    {/*<ul>
                        {currentGroup.groupMovies?.map((m, idx) => (
                            <li key={idx}>{m.movie}</li>
                        ))}
                    </ul>*/}

                    <h3>Screening Times</h3>
                    <ul>
                        {currentGroup.groupScreenings?.map((s, idx) => (
                            <li key={idx}>{s.screentime}</li>
                        ))}
                    </ul>
                </div>
            )}

            {membershipStatus !== "member" && groupVisible === false && (
                <p>You must be approved to see group details.</p>
            )}
        </div>
    );
}
