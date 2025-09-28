import { useEffect } from "react";
import { useGroups } from "../context/GroupContext.jsx";

export default function PendingRequests({ groupId }) {
    const { pendingRequests, fetchPendingRequests, decideJoinRequest } = useGroups();

    useEffect(() => {
        fetchPendingRequests(groupId);
    }, [groupId]);

    if (pendingRequests.length === 0) {
        return <p>No pending joining requests.</p>;
    }

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Odottaa hyväksyntää</h3>
            <ul className="space-y-2">
                {pendingRequests.map((req) => (
                    <li
                        key={req.id}
                        className="flex justify-between items-center p-2 bg-gray-100 rounded-md"
                    >
                        <span>{req.username} ({req.email})</span>
                        <div className="space-x-2">
                            <button
                                onClick={() => decideJoinRequest(groupId, req.user_id, true)}
                                className="px-3 py-1 bg-green-600 text-white rounded"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => decideJoinRequest(groupId, req.user_id, false)}
                                className="px-3 py-1 bg-red-600 text-white rounded"
                            >
                                Reject
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
