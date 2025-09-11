import { useUser } from "../context/useUser.js";
import { Navigate, Outlet } from "react-router-dom";

// ProtectedRoute component to guard routes that require authentication
export default function ProtectedRoute() {
    const { user } = useUser();
    if (!user || !user.token) return <Navigate to="/signin" replace />;
    return <Outlet />;
}
