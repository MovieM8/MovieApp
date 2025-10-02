import { createContext, useContext, useState } from "react";
import {
    createGroup,
    listGroups,
    getGroupDetails,
    deleteGroup,
    joinGroup,
    listPendingRequests,
    handleJoinRequest,
    removeGroupMember,
    addGroupMovie,
    addGroupScreening,
    checkGroupMembership,
    listGroupMembers,
    listMyGroups,
} from "../services/groups.js";
import { addScreenTimeToGroup as addScreenTimeToGroupService } from "../services/screenTime.js"
import { getScreenTimesByGroup, removeScreenTimeFromGroup } from "../services/screenTime.js"
import { addGroupMessage, getGroupMessages, deleteGroupMessage } from "../services/groupChat.js"
import { useUser } from "./useUser.js";
import { getMovieInfo } from "../services/TMDB.js"

const GroupContext = createContext();

export function GroupProvider({ children }) {
    const { user } = useUser();
    const [groups, setGroups] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [membershipStatus, setMembershipStatus] = useState("none"); // "none", "pending", "member"
    const [groupMembers, setGroupMembers] = useState([]);
    const [movies, setMovies] = useState([]);
    const [groupScreenTimes, setGroupScreenTimes] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    // Fetch all groups
    const fetchGroups = async () => {
        setLoading(true);
        try {
            const data = await listGroups();
            setGroups(data);
        } finally {
            setLoading(false);
        }
    };

    // Fetch user groups
    const fetchMyGroups = async () => {
        setLoading(true);
        try {
            const data = await listMyGroups(user.token);
            setGroups(data);
        } finally {
            setLoading(false);
        }
    };

    // Fetch group details
    const fetchGroupDetails = async (groupId) => {
        if (!user?.token) return;
        setLoading(true);
        try {
            const data = await getGroupDetails(groupId, user.token);
            setCurrentGroup(data);

            // get movie info
            if (!data.movieid) {
                // no movie id
                setMovies([])
            } else {
                const movieData = await getMovieInfo(data?.movieid)
                setMovies(Array.isArray(movieData) ? movieData : movieData ? [movieData] : [])
            }

        } finally {
            setLoading(false);
        }
    };

    // Create group
    const createNewGroup = async (groupname) => {
        if (!user?.token) return;
        const data = await createGroup(groupname, user.token);
        if (data) await fetchGroups();
        return data;
    };

    // Delete group
    const deleteGroupById = async (groupId) => {
        if (!user?.token) return;
        const res = await deleteGroup(groupId, user.token);
        if (res) setGroups((prev) => prev.filter((g) => g.id !== groupId));
        return res;
    };

    // Request to join group
    const requestToJoinGroup = async (groupId) => {
        if (!user?.token) return;
        return await joinGroup(groupId, user.token);
    };

    // Pending requests
    const fetchPendingRequests = async (groupId) => {
        if (!user?.token) return;
        const data = await listPendingRequests(groupId, user.token);
        setPendingRequests(data);
    };

    // Approve/reject request
    const decideJoinRequest = async (groupId, userId, approve) => {
        if (!user?.token) return;
        const res = await handleJoinRequest(groupId, userId, approve, user.token);
        await fetchPendingRequests(groupId);
        return res;
    };

    // Remove member / leave
    const removeMemberFromGroup = async (groupId, memberId) => {
        if (!user?.token) return;
        return await removeGroupMember(groupId, memberId, user.token);
    };

    // Add movie
    const addMovieToGroupContext = async (groupId, tmdbid, movie) => {
        if (!user?.token) return;
        return await addGroupMovie(groupId, tmdbid, movie, user.token);
    };

    // Add screening
    const addScreeningToGroupContext = async (groupId, screen) => {
        //if (!user?.token) return;
        //return await addGroupScreening(groupId, screenTimeId, user.token);

        if (!user?.token) return;
        try {
            const addedScreen = await addScreenTimeToGroupService(groupId, screen, user.token);
            return addedScreen; // returns the created screening time
        } catch (err) {
            console.error("Failed to add screening time to group", err);
            return null;
        }
    };

    // Check membership status of current user for a group
    const fetchMembershipStatus = async (groupId) => {
        if (!user?.token) {
            setMembershipStatus("none");
            return "none";
        }

        const statusData = await checkGroupMembership(groupId, user.token);
        let status = "none";
        if (statusData === "member" || statusData === "pending" || statusData === "none") {
            status = statusData;
        }
        //const status = statusData?.membershipStatus || "none";
        setMembershipStatus(status);
        return status; // e.g., { membershipStatus: "member" | "pending" | "none" }
    };

    // Fetch all members of a group
    const fetchGroupMembers = async (groupId) => {
        if (!user?.token) return;
        try {
            const members = await listGroupMembers(groupId, user.token);
            setGroupMembers(members);
            return members;
        } catch (err) {
            console.error("Failed to fetch group members", err);
            setGroupMembers([]);
            return [];
        }
    };

    // Group screening times
    const fetchGroupSceenTimes = async (groupId) => {
        if (!user?.token) return;
        const data = await getScreenTimesByGroup(groupId, user.token);
        setGroupScreenTimes(data || []);
        return data;
    };

    // Remove group screening time
    const removeGroupSceenTime = async (groupTimeId) => {
        if (!user?.token) return;
        const res = await removeScreenTimeFromGroup(groupTimeId, user.token);
        if (res) {
            setGroupScreenTimes((prev) => prev.filter((s) => s.group_time_id !== groupTimeId));
        }
        return res;
    };

    // Fetch group chat messages
    const fetchGroupChats = async (groupId) => {
        if (!user?.token) return;
        const data = await getGroupMessages(groupId, user.token);
        setChatMessages(data || []);
        return data;
    };

    // Add group chat message
    const addChatMessage = async (groupId, msg) => {
        if (!user?.token) return;
        try {
            const addedMessage = await addGroupMessage(groupId, msg, user.token);
            return addedMessage; // returns the added message
        } catch (err) {
            console.error("Failed to add screening time to group", err);
            return null;
        }
    };

    // Remove group chat message
    const removeChatMessage = async (messageId) => {
        if (!user?.token) return;
        const res = await deleteGroupMessage(messageId, user.token);
        if (res) {
            setChatMessages((prev) => prev.filter((m) => m.id !== messageId));
        }
        return res;
    };

    return (
        <GroupContext.Provider
            value={{
                groups,
                currentGroup,
                pendingRequests,
                loading,
                fetchGroups,
                fetchGroupDetails,
                createNewGroup,
                deleteGroupById,
                requestToJoinGroup,
                fetchPendingRequests,
                decideJoinRequest,
                removeMemberFromGroup,
                addMovieToGroupContext,
                addScreeningToGroupContext,
                fetchMembershipStatus,
                membershipStatus,
                fetchGroupMembers,
                groupMembers,
                movies,
                fetchMyGroups,
                groupScreenTimes,
                fetchGroupSceenTimes,
                removeGroupSceenTime,
                fetchGroupChats,
                addChatMessage,
                removeChatMessage,
                chatMessages,
            }}
        >
            {children}
        </GroupContext.Provider>
    );
}

export function useGroups() {
    return useContext(GroupContext);
}
