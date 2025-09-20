import { useState, useEffect } from "react";
import { UserContext } from "./UserContext.js";
import { useNavigate } from "react-router-dom";
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

     const addFavorite = async (tmdbid, movie, sharelink = null) => {
        if (!user?.token) return alert("Login required to add favorites");
        try {
            const res = await axios.post(
                `${API_URL}/favorites`,
                { tmdbid, movie, sharelink },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setFavorites((prev) => [...prev, res.data]);
        } catch (err) {
            console.error("Failed to add favorite:", err);
        }
    };

    const removeFavorite = async (movieid) => {
        if (!user?.token) return alert("Login required to remove favorites");
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
    // Effects
    // *********************************
    useEffect(() => {
        if (user?.token) {
            loadFavorites();
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
            }}
        >
            {children}
        </UserContext.Provider>
    );
}