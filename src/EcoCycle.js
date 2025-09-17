import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import Map from "./components/Map";
import { Link } from 'react-router-dom';

const EcoCycle = () => {
  const [points, setPoints] = useState(0);
  const [cash, setCash] = useState(0);
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const classifyWaste = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      const items = [
        { type: "Plastic", value: "₦30/kg" },
        { type: "Paper", value: "₦10/kg" }
      ];
      const result = items[Math.floor(Math.random() * items.length)];
      setScanResult(`${result.type}: ${result.value}`);
      setLoading(false);
    }, 1000);
  };

  const dropOffWaste = async () => {
    setLoading(true);
    setError("");
    try {
      const newPoints = points + 10;
      const newCash = cash + 50;
      setPoints(newPoints);
      setCash(newCash);
      await addDoc(collection(db, "users"), {
        name: "User",
        points: newPoints,
        cash: newCash,
        timestamp: new Date()
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to save drop-off. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-customBlack text-customWhite text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-customRed">
          EcoCycle: Transforming Ogun State Waste
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-6">
          Contribute to a cleaner Ogun State by selling plastics for ₦30/kg and earning rewards.
        </p>
        {error && <p className="text-customRed text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <button
            onClick={classifyWaste}
            disabled={loading}
            className="bg-customRed hover:bg-red-700 text-customWhite font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan Waste"}
          </button>
          <button
            onClick={() => document.getElementById("map").scrollIntoView({ behavior: "smooth" })}
            className="bg-customRed hover:bg-red-700 text-customWhite font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Find Drop-Offs
          </button>
          <button
            onClick={dropOffWaste}
            disabled={loading}
            className="bg-customRed hover:bg-red-700 text-customWhite font-semibold py-3 px-6 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Drop-Off"}
          </button>
          <Link
            to="/leaderboard"
            className="bg-customRed hover:bg-red-700 text-customWhite font-semibold py-3 px-6 rounded-lg transition duration-300 text-center block"
          >
            Leaderboard
          </Link>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            {scanResult || "Scan a waste item!"}
          </p>
        </div>
        <div className="text-center mb-8">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            Points: {points} | Cash: ₦{cash}
          </p>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
            <div
              className="bg-customRed h-4 rounded-full"
              style={{ width: `${(points / 100) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-customGray mt-1">Next Reward: ₦100 at 100 points</p>
        </div>
        <div id="map" className="mt-8">
          <Map />
        </div>
        <div className="mt-8">
          <a href="https://3mtt.gov.ng" target="_blank" rel="noopener noreferrer" className="text-customRed hover:underline">
            Proudly supported by 3MTT Cohort 3
          </a>
        </div>
      </div>
    </section>
  );
};

export default EcoCycle;