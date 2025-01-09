import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Map.module.css";
import Button from "./Button";
import {
  Marker,
  Popup,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvent,
} from "react-leaflet";
import { useCitiesContext } from "../contexts/CitiesContext";
import { useGeolocation } from "../hooks/useGeoLocation";
import { useURLPosition } from "../hooks/useURLPosition";

const Map = () => {
  const [mapPosition, setMapPosition] = useState([40, 0]);
  // destructured and renamed the values at the same time
  const [mapLat, mapLng] = useURLPosition();
  const { cities } = useCitiesContext();
  const {
    isLoading: isLoadingPosition,
    getPosition,
    position: geolocationPosition,
  } = useGeolocation();

  useEffect(() => {
    if (mapLat && mapLng) {
      setMapPosition([mapLat, mapLng]);
    }
  }, [mapLat, mapLng]);

  useEffect(() => {
    if (geolocationPosition) {
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  }, [geolocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geolocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isLoadingPosition ? "Loading..." : "Use your location"}
        </Button>
      )}
      <MapContainer
        center={mapPosition} // won't get automatically updated when mapPosition Changes
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />

        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        {/* This needs to be in <MapContainer/>  */}
        <ChangeCenter position={mapPosition} />
        <DetectClicks />
      </MapContainer>
    </div>
  );
};

// to update 'center' prop from <MapContainer /> , this component is necessary
// bc 'center' is only used for initial rendering
const ChangeCenter = ({ position }) => {
  const map = useMap(); // return map instance
  map.setView(position);
  return null;
};

// DETECT CLICKS
const DetectClicks = () => {
  const navigate = useNavigate();
  useMapEvent({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
};
export default Map;
