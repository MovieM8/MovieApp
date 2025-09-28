import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGroups } from "../context/GroupContext.jsx";

export default function GroupDetails() {
    const { groupId } = useParams();
    const { currentGroup, fetchGroupDetails, loading } = useGroups();

    useEffect(() => {
        fetchGroupDetails(groupId);
    }, [groupId]);

    if (loading) return <p>Loading group details...</p>;
    if (!currentGroup) return <p>Yor not member of this group or group is not found.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">{currentGroup.groupname}</h2>
            <p className="mb-4 text-gray-600">
                Ownwer: <strong>{currentGroup.owner}</strong>
            </p>
            <div className="space-y-2">
                <p>You can add movie and screening times to this page.</p>
                {/* Later add movie/screening forms here */}
            </div>
        </div>
    );
}
