import { createContext, useContext, useState } from "react";

const TheatreContext = createContext();

export function TheatreProvider({ children }) {
  const [selectedTheatre, setSelectedTheatre] = useState("");

  return (
    <TheatreContext.Provider value={{ selectedTheatre, setSelectedTheatre }}>
      {children}
    </TheatreContext.Provider>
  );
}

export function useTheatre() {
  return useContext(TheatreContext);
}