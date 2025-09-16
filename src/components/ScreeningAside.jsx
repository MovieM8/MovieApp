import { useState, useEffect } from "react";
import { fetchTheatres } from "../services/Finnkino.js";
import { useTheatre } from "../context/TheatreContext.jsx";

export default function ScreeningTimeMenu() {
    const [theatres, setTheatres] = useState([]);
    const { selectedTheatre, setSelectedTheatre } = useTheatre();

    useEffect(() => {
        const loadTheatres = async () => {
            const data = await fetchTheatres();
            setTheatres(data);
        };
        loadTheatres();
    }, []);

    const handleChange = (e) => {
        setSelectedTheatre(e.target.value);
    };

    return (
        <div>
            <label htmlFor="theatreSelect">Choose a theatre:</label>
            <select
                id="theatreSelect"
                value={selectedTheatre}
                onChange={handleChange}
            >
                <option value="">-- Select --</option>
                {theatres.map((theatre) => (
                    <option key={theatre.id} value={theatre.id}>
                        {theatre.name}
                    </option>
                ))}
            </select>
            <p>Movies for the next week are shown.</p>
        </div>
    );
}
