import { useState, useEffect } from "react";
import { UserContext } from "./UserContext.js";
import { useNavigate } from "react-router-dom";
import { getSharelink, saveSharelink, deleteSharelink } from "../services/favoriteshare.js";
import axios from "axios";

export default function UserProvider({ children }) {
    const userFromStorage = sessionStorage.getItem('user');
    const favoritesFromStorage = sessionStorage.getItem("favorites");

    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : { email: '', password: '', username: '' });
    const [favorites, setFavorites] = useState([]);

    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    // *********************************
    // ACCOUNT ACTIONS
    // *********************************
    const signUp = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } };
        await axios.post(`${API_URL}/user/signup`, JSON.stringify({ user: user }), headers);
        setUser({ email: "", password: "", username: "" });
    }

    const signIn = async () => {
        const headers = { headers: { 'Content-Type': 'application/json' } };
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({ user: user }), headers);
        setUser(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
    }

    // logout function
    const logout = () => {
        setUser({ email: '', username: '', password: '' });
        setSharelink(null);
        sessionStorage.removeItem('user');
        navigate('/');
    }

    // delete account function
    const deleteAccount = async () => {
        if (!user?.token) return alert("No user logged in");

        try {
            await axios.delete(`${API_URL}/user/delete`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },

                data: { user },
            });

            alert("Your account has been deleted.");
            setUser({ email: '', password: '', username: '' }); // remove user
            setSharelink(null);
            sessionStorage.removeItem("user");
            navigate("/signin");
        } catch (error) {
            console.error(error);
            alert("Failed to delete account.");
        }
    };

    // *********************************
    // FAVORITES
    // *********************************
    const loadFavorites = async () => {
        if (!user?.token) return;
        try {
            const res = await axios.get(`${API_URL}/favorites`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setFavorites(res.data);
        } catch (err) {
            console.error("Failed to load favorites:", err);
        }
    };

    const isFavorite = (tmdbid) => {
        return favorites.some((f) => f.movieid === tmdbid);
    };

    //const addFavorite = async (movieObj, sharelink = null) => {
    const addFavorite = async (movieObj) => {
        if (!user?.token) return alert("Login required to add favorites");
        const tmdbid = movieObj.id;
        const title = movieObj.title;
        if (isFavorite(tmdbid)) return; // Prevent duplicates

        // Optimistically update state
        //const newFav = { movieid: tmdbid, movie: title };
        //setFavorites((prev) => [...prev, newFav]);
        //if (options.optimistic) setFavorites(prev => [...prev, movieObj]);

        try {
            const res = await axios.post(
                `${API_URL}/favorites`,
                { tmdbid, movie: title },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setFavorites((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to add favorite:", err);
        }
    };

    const removeFavorite = async (movieid) => {
        if (!user?.token) return alert("Login required to remove favorites");

        // Optimistically update state
        //setFavorites((prev) => prev.filter((f) => f.movieid !== Number(movieid)));

        try {
            await axios.delete(`${API_URL}/favorites/${movieid}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setFavorites((prev) => prev.filter((f) => f.movieid !== Number(movieid)));
        } catch (err) {
            console.error("Failed to remove favorite:", err);
        }
    };


    // *********************************
    // sharelink
    // *********************************
    const [sharelink, setSharelink] = useState(null);

    // Load sharelink from backend
    const loadSharelink = async () => {
        if (!user?.token) return;
        try {
            const existing = await getSharelink(user.token);
            if (existing && existing.length > 0) {
                setSharelink(existing[0].sharelink);
            } else {
                setSharelink(null);
            }
        } catch (err) {
            console.error("Failed to load sharelink", err);
        }
    };

    // Create new sharelink
    const createSharelink = async () => {
        if (!user?.token || !user?.username) return;
        try {
            const newSharelink = `${Math.floor(10000000 + Math.random() * 90000000)}${user.username}`;
            const saved = await saveSharelink(newSharelink, user.token);
            if (saved?.sharelink) setSharelink(saved.sharelink);
        } catch (err) {
            console.error("Failed to create sharelink", err);
        }
    };

    // Remove sharelink
    const removeSharelink = async () => {
        if (!user?.token) return;
        try {
            await deleteSharelink(user.token);
            setSharelink(null);
        } catch (err) {
            console.error("Failed to remove sharelink", err);
        }
    };


    // *********************************
    // Effects
    // *********************************
    useEffect(() => {
        if (user?.token) {
            loadFavorites();
        }
    }, [user]);

    // Load sharelink whenever user logs in
    useEffect(() => {
        if (user?.token) {
            loadSharelink();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{
            user,
            setUser,
            signUp,
            signIn,
            logout,
            deleteAccount,
            favorites,
            loadFavorites,
            addFavorite,
            removeFavorite,
            isFavorite,
            sharelink,
            loadSharelink,
            createSharelink,
            removeSharelink,
        }}
        >
            {children}
        </UserContext.Provider>
    );
}