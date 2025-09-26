// Add here listing of all the groups and joining them
// Consider if GroupContext is needed

import { useEffect } from "react";
import { useGroups } from "../context/GroupContext.jsx";
import { Link } from "react-router-dom";

export default function GroupList() {
    const { groups, fetchGroups, loading } = useGroups();

    useEffect(() => {
        fetchGroups();
    }, []);

    if (loading) return <p>Loading groups...</p>;

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Groups</h2>
            <ul className="space-y-2">
                {groups.map((g) => (
                    <li
                        key={g.id}
                        className="p-3 bg-gray-100 rounded-md flex justify-between items-center"
                    >
                        <span>
                            {g.groupname} <span className="text-sm text-gray-500">(owner: {g.owner})</span>
                        </span>
                        <Link
                            to={`/groups/${g.id}`}
                            className="text-blue-600 hover:underline"
                        >
                            Watch
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
