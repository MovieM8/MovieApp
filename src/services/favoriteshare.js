import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get the logged-in user's sharelink
export const getSharelink = async (token) => {
    try {
        const res = await axios.get(`${API_URL}/favorites/favoritelink`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to fetch sharelink", err);
        return null;
    }
};

// Save or update the logged-in user's sharelink
export const saveSharelink = async (sharelink, token) => {
    try {
        const res = await axios.post(
            `${API_URL}/favorites/favoritelink/add`,
            { sharelink },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return res.data;
    } catch (err) {
        console.error("Failed to save sharelink", err);
        return null;
    }
};

// Delete the logged-in user's sharelink
export const deleteSharelink = async (token) => {
    try {
        const res = await axios.delete(`${API_URL}/favorites/favoritelink/delete`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return res.data;
    } catch (err) {
        console.error("Failed to delete sharelink", err);
        return null;
    }
};

// Get favorites by public sharelink (no auth needed)
export const getFavoritesBySharelink = async (sharelink) => {
    try {
        const res = await axios.get(`${API_URL}/favorites/sharelink/${sharelink}`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch favorites by sharelink", err);
        return [];
    }
};
