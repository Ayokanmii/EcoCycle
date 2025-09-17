import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const Map = () => {
  const [dropoffs, setDropoffs] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "dropoffs"), (snapshot) => {
      setDropoffs(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const defaultDropoffs = [
    { name: "Abeokuta Wecyclers", lat: 7.1500, lng: 3.3500, status: "80% full" },
    { name: "Ijebu-Ode Chanja Datti", lat: 6.8200, lng: 3.9200, status: "50% full" },
    { name: "Sango Ota Kaltani", lat: 6.6800, lng: 3.2300, status: "60% full" },
    { name: "Ota Scrapays", lat: 6.6900, lng: 3.2400, status: "90% full" },
    { name: "Ifo Hub", lat: 6.8100, lng: 3.2000, status: "70% full" }
  ];

  const positions = dropoffs.length > 0 ? dropoffs : defaultDropoffs;

  return (
    <div className="bg-customBlack p-4 rounded-lg shadow-lg">
      <MapContainer
        center={[7.1500, 3.3500]}
        zoom={10}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
        className="z-0"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <ZoomControl position="bottomright" />
        {positions.map((dropoff, index) => (
          <Marker key={index} position={[dropoff.lat, dropoff.lng]} icon={redIcon}>
            <Popup>
              <div className="text-customBlack">
                <b>{dropoff.name}</b><br />
                Status: {dropoff.status}<br />
                Sell plastics for ₦30/kg!
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-customRed">Drop-Off Status</h3>
        <ul className="mt-2 space-y-2">
          {positions.map((dropoff, index) => (
            <li key={index} className="text-customWhite">
              {dropoff.name}: {dropoff.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Map;