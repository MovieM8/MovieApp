import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Add a screening time to a group
export const addScreenTimeToGroup = async (groupId, screen, token) => {

    if (!screen) return null;

    // Map frontend fields to backend fields
    const payload = {
        groupId,
        screen: {
            showid: screen.id,
            theatreid: screen.theatreid,
            theatre: screen.showtheatre,
            auditorium: screen.auditorium,
            starttime: screen.start,
            movie: screen.title,
            tmdbid: screen.tmdbid || null, // optional
        },
    };

    try {
        const res = await axios.post(
            `${API_URL}/screentime`,
            //{ groupId, payload },
            payload,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to add screening time to group", err);
        return null;
    }
};

// Remove a screening time from a group (unlink only)
export const removeScreenTimeFromGroup = async (groupTimeId, token) => {
    try {
        const res = await axios.delete(`${API_URL}/screentime/${groupTimeId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to remove screening time from group", err);
        return null;
    }
};

// Get all screening times for a group
export const getScreenTimesByGroup = async (groupId, token) => {
    try {
        const res = await axios.get(`${API_URL}/screentime/group/${groupId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch screening times for group", err);
        return [];
    }
};
