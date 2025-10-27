// src/components/Map.jsx
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const getDropoffIcon = (fullness) => {
  if (fullness >= 80) return redIcon;
  if (fullness >= 50) return orangeIcon;
  return greenIcon;
};

// Static Drop-off Centers
const dropOffCenters = [
  { name: "Abeokuta Center", lat: 7.1475, lng: 3.3619, address: "Oke-Mosan, Abeokuta", fullness: 45 },
  { name: "Ijebu-Ode Hub", lat: 6.8205, lng: 3.9173, address: "Ibadan Road, Ijebu-Ode", fullness: 72 },
  { name: "Sango Ota Point", lat: 6.6950, lng: 3.2311, address: "Idiroko Road, Sango Ota", fullness: 30 },
  { name: "Ota Collection", lat: 6.6769, lng: 3.1593, address: "Iyana-Iyesi, Ota", fullness: 88 },
  { name: "Ifo Drop-Off", lat: 6.8161, lng: 3.1951, address: "Ifo Market Road", fullness: 55 },
];

export default function Map() {
  const [dumps, setDumps] = useState([]);
  const [dropoffs, setDropoffs] = useState(dropOffCenters);

  // Live dump sites from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "dump_sites"), (snap) => {
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }));
      setDumps(data);
    });
    return () => unsub();
  }, []);

  // Simulate fullness
  useEffect(() => {
    const interval = setInterval(() => {
      setDropoffs(prev =>
        prev.map(d => ({
          ...d,
          fullness: Math.min(100, Math.max(0, d.fullness + (Math.random() * 10 - 5)))
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Live Drop-Off & Dump Map</h2>
      
      <MapContainer
        center={[7.0, 3.35]}
        zoom={10}
        style={{ height: "500px", width: "100%", borderRadius: "12px" }}
        className="border border-gray-200 dark:border-gray-700"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        <ZoomControl position="bottomright" />

        {/* Drop-off Centers */}
        {dropoffs.map((center, i) => (
          <Marker
            key={`drop-${i}`}
            position={[center.lat, center.lng]}
            icon={getDropoffIcon(center.fullness)}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-primary">{center.name}</strong><br />
                {center.address}<br />
                <span className={`font-bold ${center.fullness >= 80 ? 'text-red-600' : center.fullness >= 50 ? 'text-orange-600' : 'text-green-600'}`}>
                  Fullness: {center.fullness.toFixed(0)}%
                </span><br />
                Sell plastics for <strong>₦30/kg</strong>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Dump Sites */}
        {dumps.map(dump => (
          <Marker
            key={dump.id}
            position={[dump.lat, dump.lng]}
            icon={redIcon}
          >
            <Popup>
              <div className="text-sm">
                <strong className="text-red-600">{dump.wasteType || "Dump Site"}</strong><br />
                {dump.description || "No description"}<br />
                <small>Reported: {dump.timestamp?.toLocaleString() || "Unknown"}</small>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
          <span>Half Full</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-600 rounded-full"></div>
          <span>Nearly Full</span>
        </div>
      </div>
    </div>
  );
}