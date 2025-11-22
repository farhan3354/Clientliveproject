import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Fix the missing default Leaflet icon issue
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerShadowPng from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FitBounds = ({ locations }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length > 0) {
      const bounds = L.latLngBounds(locations.map(loc => [loc.latitude, loc.longitude]));
      map.fitBounds(bounds);
    }
  }, [locations, map]);
  return null;
};

const UserLocationMap = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user_locations`);
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching user locations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return (
    <div className="w-full h-[600px] bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Visitor Map</h2>

      {loading ? (
        <div className="flex justify-center items-center h-full">
          <p>Loading map...</p>
        </div>
      ) : (
        <MapContainer
          center={[40.7128, -74.006]} // Default to New York
          zoom={10}
          className="w-full h-full rounded-lg z-10"
          style={{ height: "500px", borderRadius: "10px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <FitBounds locations={locations} />
          {locations.map((location, index) => (
            <Marker
              key={index}
              position={[location.latitude, location.longitude]}
              icon={customIcon}
            >
              <Popup>
                <strong>{location.country}</strong>
                <br />
                {location.ip}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default UserLocationMap;
