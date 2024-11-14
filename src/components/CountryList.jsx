import styles from "./CountryList.module.css";
import Message from "./Message";
import Spinner from "./Spinner";
import CountryItem from "./CountryItem";
import { useCitiesContext } from "../contexts/CitiesContext";

const CountryList = () => {
  const { cities, isLoading } = useCitiesContext();
  if (isLoading) <Spinner />;
  if (!cities.length) return <Message message="Add city first." />;

  const countries = cities.reduce((arr, city) => {
    const exists = arr.find((item) => item.country === city.country);
    if (!exists) {
      return [
        ...arr,
        { country: city.country, emoji: city.emoji, id: city.id },
      ];
    }
    return arr;
  }, []);
  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.id} />
      ))}
    </ul>
  );
};

export default CountryList;
