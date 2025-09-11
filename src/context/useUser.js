import { useContext } from "react";
import { UserContext } from "./UserContext.js";

// Custom hook to access user context
export const useUser = () => {
    return useContext(UserContext);
}