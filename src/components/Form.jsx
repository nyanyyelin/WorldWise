// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import styles from "./Form.module.css";
import Button from "./Button";
import { BackButton } from "./BackButton";
import { useURLPosition } from "../hooks/useURLPosition";
import Message from "./Message";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useNavigate } from "react-router-dom";

export const convertToEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
const Form = () => {
  const [lat, lng] = useURLPosition();
  const { createCity, isLoading } = useCitiesContext();
  const [isLoadingGeocoding, setIsLoadingGeocoding] = useState(false);
  const [country, setCountry] = useState("");
  const [cityName, setCityName] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [emoji, setEmoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // to prevent page reload
    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      notes,
      date,
      position: { lat, lng },
    };
    await createCity(newCity);
    navigate("/app/cities");
  };

  useEffect(() => {
    if (!lat || !lng) return;
    const fetchCityData = async () => {
      try {
        setIsLoadingGeocoding(true);
        setGeoCodingError("");
        const res = await fetch(`${BASE_URL}?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (!data.countryCode) {
          throw new Error(
            "That does not seem to be a city. Click somewhere else"
          );
        }
        setCountry(data.countryName);
        setCityName(data.city || data.locality || "");
        setEmoji(convertToEmoji(data.countryCode));
      } catch (err) {
        setGeoCodingError(err.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    };
    fetchCityData();
  }, [lat, lng]);

  if (isLoadingGeocoding) return <Message message="Loading..." />;
  if (geoCodingError) return <Message message={geoCodingError} />;
  if (!lat || !lng) {
    return <Message message="Start by clicking somewhere on the map." />;
  }
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat="MM/dd/yyy"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
};

export default Form;
