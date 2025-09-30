import { useEffect, useState } from "react";
import { useTheatre } from "../context/TheatreContext.jsx";
import { fetchSchedule } from "../services/Finnkino.js";
import { useUser } from "../context/useUser.js";
//import { useGroups } from "../context/GroupContext.jsx";
import AddScreeningToGroup from "../components/AddScreeningToGroup.jsx";
import "./ScreeningTimes.css";

export default function ScreeningTimes() {
    const { selectedTheatre } = useTheatre();
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user } = useUser();
    const [selectedScreening, setSelectedScreening] = useState(null);
    //const { addScreeningToGroupContext } = useGroups();

    // Format datetime into readable string
    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("fi-FI", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    useEffect(() => {
        if (!selectedTheatre) return;

        const loadShows = async () => {
            setLoading(true);
            const data = await fetchSchedule(selectedTheatre);
            setShows(data);
            setLoading(false);
        };

        loadShows();
    }, [selectedTheatre]);

    if (!selectedTheatre) {
        return <p>Please select a theatre</p>;
    }

    if (loading) {
        return <p>Loading screenings...</p>;
    }
    /*
      return (
        <div className="screening-times">
          {selectedTheatre ? (
            <p>Loading screenings for theatre ID: {selectedTheatre}</p>
          ) : (
            <p>Please select a theatre</p>
          )}
        </div>
      );*/

    return (
        <div className="screenings-grid">
            {shows.length === 0 ? (
                <p>No screenings available.</p>
            ) : (
                shows.map((show) => (
                    <div key={show.id} className="screening-card">
                        <img src={show.image} alt={show.title} />
                        <div className="card-content">
                            <h4>{show.title}</h4>
                            <p><strong>Start:</strong> {formatDateTime(show.start)}</p>
                            <p><strong>Theatre: </strong> {show.showtheatre}</p>
                            <p><strong>Auditorium:</strong> {show.auditorium}</p>
                            <p><strong>Language:</strong> {show.lang}</p>
                            <p><strong>Format:</strong> {show.method}</p>
                        </div>

                        {/* Add screening button on hover for logged in users */}
                        {user?.token && (
                            <button
                                className="screening-group-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    setSelectedScreening(show);
                                }}
                            >
                                + Add to Group
                            </button>
                        )}
                    </div>
                ))
            )}

            {selectedScreening && (
                <AddScreeningToGroup
                    screening={selectedScreening}
                    onClose={() => setSelectedScreening(null)}
                />
            )}
        </div>
    );
}

