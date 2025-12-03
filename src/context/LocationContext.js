import { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [locationName, setLocationName] = useState(""); 
  const [TownName, setTownName] = useState(""); 

  return (
    <LocationContext.Provider value={{ locationName, setLocationName,TownName,setTownName }}>
      {children}
    </LocationContext.Provider>
  );
};