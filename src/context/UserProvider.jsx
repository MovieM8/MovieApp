import { useState } from "react"; 
import { UserContext } from "./UserContext.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProvider({ children }) {
    const userFromStorage = sessionStorage.getItem('user');
    const [user, setUser] = useState(userFromStorage ? JSON.parse(userFromStorage) : {email: '', password: ''});
    const navigate = useNavigate();
    
    const signUp = async () => {
        const headers = {headers: {'Content-Type': 'application/json'}};
        await axios.post(`${import.meta.env.VITE_API_URL}/user/signup`, JSON.stringify({user: user}), headers);
        setUser({email: "", password: ""});
    }

    const signIn = async () => {
        const headers = {headers: {'Content-Type': 'application/json'}};
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/signin`, JSON.stringify({user: user}), headers);
        setUser(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
    }

    // logout function
    const logout = () => {
        setUser({email: '', password: ''});
        sessionStorage.removeItem('user');
        navigate('/');
    }

    // delete account function
    const deleteAccount = async () => {
        if (!user?.token) return alert("No user logged in");
        const headers = {headers: {'Content-Type': 'application/json'}, Authorization: `Bearer ${user.token}` };

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/delete`, JSON.stringify({user: user}), headers);
            alert("Your account has been deleted.");
            setUser(null); // remove user and token
            navigate("/signup");
        } catch (error) {
            console.error(error);
            alert("Failed to delete account.");
        }
    };
   
    return (
        <UserContext.Provider value={{user, setUser, signUp, signIn, logout, deleteAccount}}>
            {children}
        </UserContext.Provider>
    );
}