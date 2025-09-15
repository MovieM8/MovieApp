import { useTheatre } from "../context/TheatreContext.jsx";

export default function ScreeningTimes() {
        const { selectedTheatre } = useTheatre();

  return (
    <div className="screening-times">
      {selectedTheatre ? (
        <p>Loading screenings for theatre ID: {selectedTheatre}</p>
      ) : (
        <p>Please select a theatre</p>
      )}
    </div>
  );
}

