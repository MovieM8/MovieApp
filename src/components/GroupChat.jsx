import { useEffect, useState } from "react";
import { useGroups } from "../context/GroupContext.jsx";
import { useUser } from "../context/useUser.js";
import "./GroupChat.css";

export default function GroupChat({ groupId }) {
    const { user } = useUser();
    const {
        fetchGroupChats,
        addChatMessage,
        removeChatMessage,
        membershipStatus,
        currentGroup,
    } = useGroups();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const isMember = membershipStatus === "member";
    const isOwner = currentGroup?.groupowner === user?.id;

    useEffect(() => {
        const loadChats = async () => {
            if (!user?.token) return;
            setLoading(true);
            const data = await fetchGroupChats(groupId);
            setMessages(data || []);
            setLoading(false);
        };
        loadChats();
    }, [groupId, user]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const added = await addChatMessage(groupId, newMessage.trim());
        if (added) {
            setMessages((prev) => [{ ...added, username: user.username }, ...prev]);
            setNewMessage("");
        }
    };

    const handleDelete = async (messageId) => {
        const res = await removeChatMessage(messageId);
        if (res) {
            setMessages((prev) => prev.filter((m) => m.id !== messageId));
        }
    };

    return (
        <div className="group-chat">
            {/*<h3>Group Chat</h3>*/}

            {loading ? (
                <p>Loading messages...</p>
            ) : (
                <div className="chat-messages">
                    {messages.length === 0 && <p>No messages yet.</p>}
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`chat-message ${msg.user_id === user?.id ? "own" : ""}`}
                        >
                            <div className="chat-header">
                                <span className="chat-user">{msg.username}</span>
                                <span className="chat-time">
                                    {new Date(msg.send_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="chat-body">
                                <p>{msg.msg}</p>
                                {(msg.user_id === user?.id || isOwner) && (
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(msg.id)}
                                    >
                                        ✖
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isMember && (
                <form className="chat-input" onSubmit={handleSend}>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit">Send</button>
                </form>
            )}

            {!isMember && <p>You must be a group member to send messages.</p>}
        </div>
    );
}
