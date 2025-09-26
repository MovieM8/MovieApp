import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Create group
export const createGroup = async (groupname, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/groups`,
            { groupname },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to create group", err);
        return null;
    }
};

// List all groups (public)
export const listGroups = async () => {
    try {
        const res = await axios.get(`${API_URL}/groups`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch groups", err);
        return [];
    }
};

// Get group details (members only)
export const getGroupDetails = async (groupId, token) => {
    try {
        const res = await axios.get(`${API_URL}/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch group details", err);
        return null;
    }
};

// Delete group (only owner)
export const deleteGroup = async (groupId, token) => {
    try {
        const res = await axios.delete(`${API_URL}/groups/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to delete group", err);
        return null;
    }
};

// Request to join group
export const joinGroup = async (groupId, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/groups/${groupId}/join`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to request to join group", err);
        return null;
    }
};

// List pending requests (only owner)
export const listPendingRequests = async (groupId, token) => {
    try {
        const res = await axios.get(`${API_URL}/groups/${groupId}/requests`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch pending requests", err);
        return [];
    }
};

// Approve/reject join
export const handleJoinRequest = async (groupId, userId, approve, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/groups/${groupId}/requests/${userId}`,
            { approve },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to handle join request", err);
        return null;
    }
};

// Remove member or leave
export const removeGroupMember = async (groupId, userId, token) => {
    try {
        const res = await axios.delete(`${API_URL}/groups/${groupId}/members/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to remove member", err);
        return null;
    }
};

// Add movie to group
export const addGroupMovie = async (groupId, tmdbid, movie, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/groups/${groupId}/movie`,
            { tmdbid, movie },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to add movie to group", err);
        return null;
    }
};

// Add screening to group
export const addGroupScreening = async (groupId, screenTimeId, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/groups/${groupId}/screening`,
            { screenTimeId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to add screening to group", err);
        return null;
    }
};

// Get group membership (for logged in user)
export const checkGroupMembership = async (groupId, token) => {
    try {
        const res = await axios.get(`${API_URL}/groups/membership/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch group details", err);
        return null;
    }
};

// List all members of a group (with roles)
export const listGroupMembers = async (groupId, token) => {
    try {
        const res = await axios.get(`${API_URL}/groups/${groupId}/members`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch group members", err);
        return [];
    }
};