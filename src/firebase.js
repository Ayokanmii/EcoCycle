// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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
export const auth = getAuth(app);
export const db = getFirestore(app);