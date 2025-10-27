// src/components/EcoCycleCore.jsx
import { useState, useRef, useEffect } from "react";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function EcoCycleCore() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [wallet, setWallet] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [dumpLocation, setDumpLocation] = useState("");
  const [loading, setLoading] = useState(false);
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

  const startCamera = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const stream = await navigator.mediacDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied. Please allow camera.");
      setScanning(false);
    }
  };

  const stopCamera = () => {
    setScanning(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
  };

  const captureAndClassify = async () => {
    if (!videoRef.current) return;

    setLoading(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) {
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

        const data = await res.json();

        if (data.error) {
          alert("AI Error: " + data.error);
          setLoading(false);
          return;
        }

        // Update wallet in Firestore
        const reward = data.price_per_kg;
        const newWallet = wallet + reward;
        setWallet(newWallet);

        await setDoc(doc(db, "users", auth.currentUser.uid), {
          wallet: newWallet
        }, { merge: true });

        setScanResult({
          class: data.class,
          confidence: data.confidence,
          reward: reward
        });

      } catch (err) {
        alert("Backend not running. Start: uvicorn main:app --reload");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  const reportDump = async () => {
    if (!dumpLocation.trim()) return;

    try {
      await setDoc(doc(db, "dumps", Date.now().toString()), {
        location: dumpLocation,
        timestamp: serverTimestamp(),
        user: auth.currentUser.email,
      });
      alert("Dump reported! Thank you.");
      setDumpLocation("");
      setShowReport(false);
    } catch (err) {
      alert("Failed to report. Try again.");
    }
  };

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4">
          Turn Waste into Cash
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Scan recyclables. Earn <strong className="text-accent">₦30/kg</strong>. 
          Help Ogun State reach <strong className="text-accent">500 tons</strong>.
        </p>

        {/* Wallet */}
        <div className="bg-primary text-white p-6 rounded-xl inline-block mb-8 shadow-lg">
          <p className="text-sm opacity-90">Your Wallet</p>
          <p className="text-3xl font-bold">₦{wallet}</p>
        </div>

        {/* Camera */}
        <div className="relative inline-block">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full max-w-md rounded-xl shadow-lg border-4 border-gray-200"
            style={{ display: scanning ? "block" : "none" }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {!scanning ? (
            <button
              onClick={startCamera}
              className="bg-primary text-white px-8 py-4 rounded-lg hover:bg-green-700 transition font-bold text-lg shadow-md"
            >
              Start Camera
            </button>
          ) : (
            <div className="mt-6 space-x-4">
              <button
                onClick={captureAndClassify}
                disabled={loading}
                className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-green-800 disabled:opacity-50 font-semibold"
              >
                {loading ? "Analyzing..." : "Scan Waste"}
              </button>
              <button
                onClick={stopCamera}
PROG                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-semibold"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {/* AI Result */}
        {scanResult && (
          <div className="mt-8 p-5 bg-green-50 border-2 border-green-300 rounded-xl max-w-md mx-auto">
            <p className="text-primary font-bold text-xl">
              Detected: <span className="text-accent">{scanResult.class}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Confidence: {(scanResult.confidence * 100).toFixed(0)}%
            </p>
            <p className="text-lg font-bold text-green-700 mt-2">
              +₦{scanResult.reward} added!
            </p>
          </div>
        )}

        {/* Report Dump */}
        <div className="mt-12">
          <button
            onClick={() => setShowReport(true)}
            className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-semibold"
          >
            Report Illegal Dump
          </button>
        </div>

        {/* Report Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-xl max-w-md w-full shadow-2xl">
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