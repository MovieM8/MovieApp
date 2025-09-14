import { useUser } from "../context/useUser.js";

export default function DeleteAccount() {
    const { deleteAccount } = useUser();

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
            return;
        }
        await deleteAccount(); // await ensures API call completes
    };

    return (
        <div id="page-container">
            <h3>Delete Account</h3>
            <p>Warning: This action cannot be undone.</p>
            <button className="btn btn-danger" onClick={handleDelete}>
                Delete My Account
            </button>
        </div>
    );
}