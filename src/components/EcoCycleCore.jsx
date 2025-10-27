// src/components/EcoCycleCore.jsx
import { useState, useRef, useEffect } from "react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaTimes } from "react-icons/fa";

export default function EcoCycleCore() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [dumpLocation, setDumpLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load wallet from Firestore
  useEffect(() => {
    const loadWallet = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWallet(docSnap.data().wallet || 0);
        }
      }
    };
    loadWallet();
  }, []);

  // Start Camera
  const startCamera = async () => {
    setScanning(true);
    setScanResult(null);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied. Please allow in browser settings.");
      setScanning(false);
      console.error(err);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    setScanning(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  // Capture & Classify
  const captureAndClassify = async () => {
    if (!videoRef.current) return;

    setLoading(true);
    setError("");
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError("Failed to capture image.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "waste.jpg");

      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
        const res = await fetch(`${API_URL}/classify`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const err = await res.text();
          throw new Error(err || "AI server error");
        }

        const data = await res.json();

        const reward = data.price_per_kg || 0;
        const newWallet = wallet + reward;
        setWallet(newWallet);

        // Update Firestore
        if (auth.currentUser) {
          await setDoc(doc(db, "users", auth.currentUser.uid), {
            wallet: newWallet
          }, { merge: true });
        }

        setScanResult({
          class: data.class,
          confidence: data.confidence,
          reward: reward,
          recyclable: data.recyclable
        });

      } catch (err) {
        setError("AI scan failed. Try a clearer image.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  // Report Dump
  const reportDump = async () => {
    if (!dumpLocation.trim()) {
      setError("Enter location");
      return;
    }

    try {
      await setDoc(doc(db, "dumps", Date.now().toString()), {
        location: dumpLocation,
        timestamp: serverTimestamp(),
        user: auth.currentUser?.email || "anonymous",
      });
      setSuccess("Dump reported!");
      setDumpLocation("");
      setShowReport(false);
    } catch (err) {
      setError("Failed to report.");
    }
  };

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <section className="py-12 bg-gradient-to-b from-white to-green-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
          Turn Waste into Cash
        </h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Scan recyclables. Earn <strong className="text-accent">₦30/kg</strong>. 
          Help Ogun State reach <strong className="text-accent">500 tons</strong>.
        </p>

        {/* Wallet */}
        <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-2xl inline-block mb-8 shadow-xl">
          <p className="text-sm opacity-90">Your Wallet</p>
          <p className="text-4xl font-bold">₦{wallet.toLocaleString()}</p>
        </div>

        {/* Camera */}
        <div className="relative inline-block max-w-md w-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded-2xl shadow-2xl border-4 border-gray-200"
            style={{ display: scanning ? "block" : "none" }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {!scanning ? (
            <button
              onClick={startCamera}
              className="bg-primary text-white px-8 py-4 rounded-2xl hover:bg-accent transition font-bold text-lg shadow-lg flex items-center gap-3 mx-auto"
            >
              <FaCamera /> Start Camera
            </button>
          ) : (
            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={captureAndClassify}
                disabled={loading}
                className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center gap-2"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Scan Waste"}
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 font-semibold"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {/* Error / Success */}
        {(error || scanResult) && (
          <div className={`mt-6 p-5 rounded-xl max-w-md mx-auto ${
            error ? "bg-red-50 border-2 border-red-300 text-red-700" : "bg-green-50 border-2 border-green-300 text-green-700"
          }`}>
            {error && (
              <p className="flex items-center justify-center gap-2">
                <FaExclamationTriangle /> {error}
              </p>
            )}
            {scanResult && (
              <div>
                <p className="font-bold text-xl">
                  Detected: <span className="text-accent">{scanResult.class}</span>
                </p>
                <p className="text-sm mt-1">
                  Confidence: {(scanResult.confidence * 100).toFixed(0)}%
                </p>
                {scanResult.recyclable ? (
                  <p className="text-lg font-bold mt-2">
                    <FaCheckCircle className="inline text-green-600" /> +₦{scanResult.reward} added!
                  </p>
                ) : (
                  <p className="text-red-600">Not recyclable</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Report Dump */}
        <div className="mt-12">
          <button
            onClick={() => setShowReport(true)}
            className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition font-semibold flex items-center gap-2 mx-auto"
          >
            <FaExclamationTriangle /> Report Illegal Dump
          </button>
        </div>

        {/* Report Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
              <button
                onClick={() => setShowReport(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
              <h3 className="text-xl font-bold text-primary mb-4">Report Dump Site</h3>
              <input
                type="text"
                placeholder="e.g., Sango Ota Market"
                value={dumpLocation}
                onChange={(e) => setDumpLocation(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-3">
                <button
                  onClick={reportDump}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-green-700 font-medium"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* How to Recycle */}
        <div className="mt-12">
          <button
            onClick={() => navigate("/how-to-recycle")}
            className="text-accent hover:underline font-medium text-lg"
          >
            How to Recycle
          </button>
        </div>

      </div>
    </section>
  );
}
