import { createContext, useState, useContext, useEffect } from "react";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        setCities(data);
      } catch {
        alert("Error fetching data!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCitiesContext = () => {
  const context = useContext(CitiesContext);
  if (context === "undefined") {
    throw new Error("Use CitiesContext in the right place!");
  }
  return context;
};

export { CitiesProvider, useCitiesContext };
