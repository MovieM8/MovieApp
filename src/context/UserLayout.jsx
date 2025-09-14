import { Outlet } from "react-router-dom";
import UserProvider from "./UserProvider.jsx";

export default function UserLayout() {
  return (
    <UserProvider>
      <Outlet /> 
    </UserProvider>
  );
}