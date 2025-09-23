import { useUser } from "../context/useUser.js";

export default function MyProfileContent() {
    const { user } = useUser();
    return (
        <div id="profile-container">
            <h3>Welcome to your profile page {user.username}!</h3>
            <p>Use the menu as need for the actions.</p>
        </div>
    )
}
