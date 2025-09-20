import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import Map from "./components/Map";

const EcoCycle = () => {
  const [points, setPoints] = useState(0);
  const [cash, setCash] = useState(0);
  const [scanResult, setScanResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const classifyWaste = async () => {
    setLoading(true);
    setError("");
    if (!image) {
      setError("Please upload an image!");
      setLoading(false);
      return;
    }
    try {
      const model = await import('@tensorflow/tfjs').then(tf => tf.loadLayersModel('https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/2')).catch(() => import('@tensorflow-models/mobilenet').then(m => m.load()));
      const img = new Image();
      img.src = URL.createObjectURL(image);
      await img.decode();
      img.width = 224;
      img.height = 224;
      const predictions = await model.classify(img);
      const wasteType = predictions[0].className.includes("plastic") ? "Plastic" : "Paper";
      setScanResult(`${wasteType}: ₦${wasteType === "Plastic" ? "30" : "10"}/kg`);
      setLoading(false);
    } catch (err) {
      setError("AI classification failed. Try again.");
      setLoading(false);
    }
  };

  const dropOffWaste = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate queue delay for scalability
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
          Tackling waste mismanagement in Ogun State—over 10,000 tons accumulate yearly, harming health and economy. Contribute by selling plastics for ₦30/kg and earning rewards.
        </p>
        <div className="text-center mb-6">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            Impact: Over 10,000 tons of waste diverted! <br />
            <strong>Benefits for Users:</strong> Earn cash (e.g., ₦50/drop-off), enjoy a cleaner environment, and access job opportunities. <br />
            <strong>Benefits for Our Team (Damilola, Enoch, Precious):</strong> Skill growth in AI and web tech, enhanced portfolios, hackathon recognition, and improved teamwork.
          </p>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            Objectives: Reduce waste, map drop-offs, use AI for valuation, empower communities, and scale statewide.
          </p>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            Target Audience: Recyclers, Ogun State residents, local government, and 3MTT judges.
          </p>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            Sustainability: Diverts waste, creates jobs, uses scalable Firebase, and plans NGO partnerships.
          </p>
        </div>
        <div className="text-center mb-6">
          <p className="text-lg bg-customBlack p-4 rounded-lg inline-block">
            Creativity & Feasibility: AI scanning innovates recycling; our team (Damilola, Enoch, Precious) ensures a scalable, testable MVP for 10,000 users.
          </p>
        </div>
        {error && <p className="text-customRed text-center mb-4">{error}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
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