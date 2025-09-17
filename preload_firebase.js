import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA2xIT70UjBeKAz1zMWzmPKoRgqd8QL9rA",
  authDomain: "ecocycle-2a468.firebaseapp.com",
  projectId: "ecocycle-2a468",
  storageBucket: "ecocycle-2a468.firebasestorage.app",
  messagingSenderId: "23689172752",
  appId: "1:23689172752:web:10d0b002d91add06853795",
  measurementId: "G-R1QHBBE6E6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dropoffs = [
  { name: "Abeokuta Wecyclers", lat: 7.1500, lng: 3.3500, status: "80% full" },
  { name: "Ijebu-Ode Chanja Datti", lat: 6.8200, lng: 3.9200, status: "50% full" },
  { name: "Sango Ota Kaltani", lat: 6.6800, lng: 3.2300, status: "60% full" },
  { name: "Ota Scrapays", lat: 6.6900, lng: 3.2400, status: "90% full" },
  { name: "Ifo Hub", lat: 6.8100, lng: 3.2000, status: "70% full" }
];

dropoffs.forEach(async (dropoff) => {
  await addDoc(collection(db, "dropoffs"), dropoff);
});