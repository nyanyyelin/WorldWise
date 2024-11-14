import { createContext, useState, useContext, useEffect } from "react";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

const CitiesProvider = ({ children }) => {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

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

  const getCity = async (id) => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      setCurrentCity(data);
    } catch {
      alert("Error fetching current city data!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        setIsLoading,
        currentCity,
        getCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

const useCitiesContext = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("Use CitiesContext in the right place!");
  }
  return context;
};

export { CitiesProvider, useCitiesContext };
