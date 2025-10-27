// src/pages/EcoCycle.jsx
import React, { useState, useRef, useEffect } from "react";
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
// 1. Tiny toast component (no dependencies)
// ---------------------------------------------------------------
const Toast = ({ msg, type = "success", onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white font-medium animate-fadeIn ${
        type === "error" ? "bg-red-600" : "bg-green-600"
      }`}
    >
      {type === "success" ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {msg}
    </div>
  );
};

// ---------------------------------------------------------------
// 2. API helpers (same URL you use elsewhere)
// ---------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || "https://ecocycle-backend.onrender.com";

const classifyWaste = async (imageDataUrl) => {
  // data:image/jpeg;base64,....
  const base64 = imageDataUrl.split(",")[1];
  const blob = await (await fetch(`data:application/octet-stream;base64,${base64}`)).blob();

  const form = new FormData();
  form.append("file", blob, "waste.jpg");

  const res = await fetch(`${API_URL}/classify`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`AI error ${res.status}`);
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
// 3. Main component
// ---------------------------------------------------------------
const EcoCycle = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState("");          // data URL
  const [preview, setPreview] = useState("");      // for UI
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [toast, setToast] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ---------- CAMERA ----------
  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera in browser settings.");
      console.error(err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setPreview(dataUrl);
    setImage(dataUrl);
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      setCameraActive(false);
    }
  };

  // ---------- AI SCAN ----------
  const runClassification = async () => {
    if (!image) {
      setError("Please capture or upload an image.");
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
          ? `Earn ₦${data.price_per_kg}/kg`
          : "Not recyclable"
      );
    } catch (err) {
      setError("AI scan failed. Try a clearer image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- DROP‑OFF + WALLET ----------
  const dropOffWaste = async () => {
    if (!scanResult) return;

    setLoading(true);
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

      // 2. Credit wallet (estimated 1 kg for demo)
      const reward = scanResult.price_per_kg; // ₦ per kg
      await addReward(auth.currentUser.uid, reward);

      setToast({
        msg: `Drop‑off confirmed! +₦${reward} added to your wallet.`,
        type: "success",
      });

      // Reset UI
      setImage("");
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

  // Cleanup
  useEffect(() => () => stopCamera(), []);

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            EcoCycle: Ogun State Waste Solution
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto animate-fadeIn delay-300">
            <strong className="text-accent">10,000+ tons</strong> diverted. 
            <strong className="text-accent"> ₦30/kg</strong> for plastics. 
            <strong className="text-accent">500+</strong> recyclers.
          </p>
        </div>

        {/* Scan Interface */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">
            Scan & Earn
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* LEFT: Camera / Upload */}
            <div className="space-y-4">
              {/* Upload placeholder */}
              {!cameraActive && !preview && (
                <div
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <FaCamera className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Click to upload
                  </p>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const url = URL.createObjectURL(f);
                        setImage(url);
                        setPreview(url);
                      }
                    }}
                  />
                </div>
              )}

              {/* Live camera */}
              {cameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-accent"
                  >
                    <FaCamera />
                  </button>
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                  <button
                    onClick={() => {
                      setPreview("");
                      setImage("");
                    }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full text-xs"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Open Camera button */}
              {!cameraActive && !preview && (
                <button
                  onClick={startCamera}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <FaCamera /> Open Camera
                </button>
              )}
            </div>

            {/* RIGHT: Actions */}
            <div className="space-y-4">
              <button
                onClick={runClassification}
                disabled={loading || !image}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Scan Waste"
                )}
              </button>

              <button
                onClick={dropOffWaste}
                disabled={loading || !scanResult}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <FaCheckCircle /> Confirm Drop‑Off
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
            <FaMapMarkerAlt /> Live Dump Reports
          </h2>
          <div className="h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <Map />
          </div>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
};

export default EcoCycle;
