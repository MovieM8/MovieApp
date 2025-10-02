import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Add a message to a group chat
export const addGroupMessage = async (groupId, msg, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/groupchat`,
            { groupId, msg },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to add message to group chat", err);
        return null;
    }
};

// Get all messages for a group
export const getGroupMessages = async (groupId, token) => {
    try {
        const res = await axios.get(`${API_URL}/groupchat/group/${groupId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch group messages", err);
        return [];
    }
};

// Delete a group message (by author or group owner)
export const deleteGroupMessage = async (messageId, token) => {
    try {
        const res = await axios.delete(`${API_URL}/groupchat/${messageId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to delete group message", err);
        return null;
    }
};
