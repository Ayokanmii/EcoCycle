// src/pages/EcoCycle.jsx
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
} from "react-icons/fa";

// ---------------------------------------------------------------
// 1. Tiny toast (no deps)
// ---------------------------------------------------------------
const Toast = ({ msg, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white font-medium animate-fadeIn transition-all ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
      {msg}
    </div>
  );
};

// ---------------------------------------------------------------
// 2. API helpers
// ---------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || "https://ecocycle-backend.onrender.com";

const classifyWaste = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/classify`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `HTTP ${res.status}`);
  }
  return res.json();
};

const addReward = async (uid, amount) => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${API_URL}/wallet/${uid}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error(`Wallet error ${res.status}`);
  return res.json();
};

// ---------------------------------------------------------------
// 3. Main page
// ---------------------------------------------------------------
const EcoCycle = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);          // File object
  const [preview, setPreview] = useState("");        // URL for UI
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState(null);

  // -----------------------------------------------------------------
  // File picker (desktop + mobile camera)
  // -----------------------------------------------------------------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setError("");
    setSuccess("");
    setScanResult(null);
  };

  // -----------------------------------------------------------------
  // AI classification
  // -----------------------------------------------------------------
  const runClassification = async () => {
    if (!image) {
      setError("Please upload an image of waste.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await classifyWaste(image);
      setScanResult(data);
      setSuccess(
        data.recyclable
          ? `Earn ₦${data.price_per_kg}/kg at drop‑off`
          : "Not recyclable"
      );
    } catch (err) {
      setError("AI scan failed. Try a clearer image.");
      setToast({ msg: "Scan failed", type: "error" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // Drop‑off + wallet credit
  // -----------------------------------------------------------------
  const dropOffWaste = async () => {
    if (!scanResult) {
      setError("Scan an item first!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Record drop‑off
      await addDoc(collection(db, "dropoffs"), {
        userId: auth.currentUser?.uid || "anonymous",
        wasteType: scanResult.class,
        pricePerKg: scanResult.price_per_kg,
        timestamp: serverTimestamp(),
        status: "confirmed",
        earnings: scanResult.price_per_kg,
      });

      // 2. Credit wallet (1 kg for demo)
      const reward = scanResult.price_per_kg;
      await addReward(auth.currentUser.uid, reward);

      setToast({
        msg: `Drop‑off confirmed! +₦${reward} added to your wallet.`,
        type: "success",
      });

      // Reset UI
      setImage(null);
      setPreview("");
      setScanResult(null);
      setSuccess("");
    } catch (err) {
      setError("Failed to record drop‑off.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            EcoCycle: Ogun State Waste Solution
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto animate-fadeIn delay-300">
            <strong className="text-accent">10,000+ tons</strong> of waste diverted. 
            <strong className="text-accent"> ₦30/kg</strong> for plastics. 
            <strong className="text-accent">500+</strong> active recyclers.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-5 py-2 rounded-full text-sm font-bold">
            <FaExclamationTriangle /> Transforming waste into income and sustainability across Ogun State.
          </div>
        </div>

        {/* Impact Summary */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-bold text-primary">Problem</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              10,000+ tons of unmanaged waste yearly in Ogun State.
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary to-accent p-6 rounded-xl shadow-lg text-white text-center">
            <h3 className="text-lg font-bold">Solution</h3>
            <p className="mt-2">
              AI‑powered scanning + cash incentives + live mapping.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg font-bold text-primary">Impact</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Cleaner communities, jobs, and scalable recycling.
            </p>
          </div>
        </div>

        {/* Scan Interface */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Scan & Earn
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT – Upload / Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Upload Waste Image
              </label>

              {/* Preview */}
              {preview && (
                <div className="mb-4 relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg shadow-md"
                  />
                  <button
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Upload placeholder */}
              {!preview && (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FaCamera className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload or take a photo
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    capture="environment"   // opens back camera on mobile
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* RIGHT – Actions */}
            <div className="space-y-4">
              <button
                onClick={runClassification}
                disabled={loading || !image}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Scanning...
                  </>
                ) : (
                  "Scan Waste"
                )}
              </button>

              <button
                onClick={dropOffWaste}
                disabled={loading || !scanResult}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaCheckCircle />{" "}
                {loading ? "Confirming..." : "Confirm Drop‑Off"}
              </button>
            </div>
          </div>

          {/* Result / Messages */}
          {(error || success || scanResult) && (
            <div
              className={`mt-6 p-4 rounded-lg text-center font-medium ${
                error
                  ? "bg-red-100 text-red-700"
                  : success
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {error && (
                <span className="flex items-center justify-center gap-2">
                  <FaExclamationTriangle /> {error}
                </span>
              )}
              {success && (
                <span className="flex items-center justify-center gap-2">
                  <FaCheckCircle /> {success}
                </span>
              )}
              {scanResult && !success && !error && (
                <div>
                  <strong className="text-green-600">{scanResult.class}</strong>{" "}
                  ({Math.round(scanResult.confidence * 100)}% confidence)
                  <br />
                  {scanResult.recyclable ? (
                    <span>
                      Earn{" "}
                      <strong className="text-yellow-600">
                        ₦{scanResult.price_per_kg}/kg
                      </strong>
                    </span>
                  ) : (
                    <span className="text-red-600">Not recyclable</span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Map */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
            <FaMapMarkerAlt /> Find Nearest Drop‑Off
          </h2>
          <div className="h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Map />
          </div>
        </div>

        {/* Team Credit */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Built by <strong>Damilola (Full‑Stack)</strong>,{" "}
            <strong>Enoch (AI Lead)</strong>, <strong>Precious (Docs)</strong>
          </p>
          <p className="mt-2">
            For a cleaner, wealthier Ogun State.
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <Toast
            msg={toast.msg}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </section>
  );
};

export default EcoCycle;
