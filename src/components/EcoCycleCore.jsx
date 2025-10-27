// src/components/EcoCycleCore.jsx
import { useState, useRef, useEffect } from "react";
import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaTimes,
  FaTrashAlt,
} from "react-icons/fa";

// ---------------------------------------------------------------
// 1. Tiny Toast (no deps)
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
      {type === "success" ? (
        <FaCheckCircle />
      ) : (
        <FaExclamationTriangle />
      )}
      {msg}
    </div>
  );
};

// ---------------------------------------------------------------
// 2. API Helpers
// ---------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || "https://ecocycle-backend.onrender.com";

const classifyWaste = async (blob) => {
  const form = new FormData();
  form.append("file", blob, "waste.jpg");

  const res = await fetch(`${API_URL}/classify`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Server error ${res.status}`);
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
  if (!res.ok) throw new Error(`Wallet update failed`);
  return res.json();
};

// ---------------------------------------------------------------
// 3. Main Component
// ---------------------------------------------------------------
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
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  // Load wallet
  useEffect(() => {
    const load = async () => {
      if (auth.currentUser) {
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (snap.exists()) setWallet(snap.data().wallet || 0);
      }
    };
    load();
  }, []);

  // Start Camera (mobile back camera)
  const startCamera = async () => {
    setScanning(true);
    setScanResult(null);
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Back camera
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
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  // Capture + AI + Reward
  const captureAndClassify = async () => {
    if (!videoRef.current) return;

    setLoading(true);
    setError("");
    setScanResult(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError("Failed to capture image.");
        setLoading(false);
        return;
      }

      try {
        const data = await classifyWaste(blob);
        const reward = data.price_per_kg || 0;
        const newWallet = wallet + reward;

        // Update UI
        setWallet(newWallet);
        setScanResult({
          class: data.class,
          confidence: data.confidence,
          reward,
          recyclable: data.recyclable,
        });

        // Sync backend + Firestore
        if (auth.currentUser) {
          await addReward(auth.currentUser.uid, reward);
          await setDoc(
            doc(db, "users", auth.currentUser.uid),
            { wallet: newWallet },
            { merge: true }
          );
        }

        setToast({ msg: `+₦${reward} earned!`, type: "success" });
      } catch (err) {
        setError("AI scan failed. Try a clearer image.");
        setToast({ msg: "Scan failed", type: "error" });
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, "image/jpeg", 0.9);
  };

  // Report Dump
  const reportDump = async () => {
    if (!dumpLocation.trim()) {
      setError("Please enter a location");
      return;
    }

    try {
      await setDoc(doc(db, "dumps", Date.now().toString()), {
        location: dumpLocation,
        timestamp: serverTimestamp(),
        user: auth.currentUser?.email || "anonymous",
      });
      setToast({ msg: "Dump reported! Thank you.", type: "success" });
      setDumpLocation("");
      setShowReport(false);
    } catch (err) {
      setError("Failed to report dump.");
    }
  };

  // Cleanup
  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <section className="py-16 bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">

        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold text-primary mb-4 animate-fadeIn">
          Turn Waste into Cash
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto animate-fadeIn delay-300">
          Scan recyclables. Earn <strong className="text-accent">₦30/kg</strong>. 
          Help Ogun State reach <strong className="text-accent">500 tons</strong>.
        </p>

        {/* Wallet Card */}
        <div className="bg-gradient-to-r from-primary to-accent text-white p-6 rounded-2xl inline-block mb-10 shadow-xl hover-lift">
          <p className="text-sm opacity-90">Your Wallet</p>
          <p className="text-4xl font-bold">₦{wallet.toLocaleString()}</p>
        </div>

        {/* Camera Section */}
        <div className="relative inline-block max-w-md w-full mb-10">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full rounded-2xl shadow-2xl border-4 border-gray-200 dark:border-gray-700"
            style={{ display: scanning ? "block" : "none" }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {!scanning ? (
            <button
              onClick={startCamera}
              className="bg-primary text-white px-8 py-4 rounded-2xl hover:bg-accent transition-all font-bold text-lg shadow-lg flex items-center gap-3 mx-auto hover-lift"
            >
              <FaCamera /> Start Camera
            </button>
          ) : (
            <div className="mt-6 flex gap-4 justify-center">
              <button
                onClick={captureAndClassify}
                disabled={loading}
                className="bg-accent text-white px-6 py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 font-semibold flex items-center gap-2 shadow-md"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  "Scan Waste"
                )}
              </button>
              <button
                onClick={stopCamera}
                className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 font-semibold shadow-md"
              >
                Stop
              </button>
            </div>
          )}
        </div>

        {/* Error / Result */}
        {(error || scanResult) && (
          <div
            className={`mt-6 p-5 rounded-xl max-w-md mx-auto transition-all ${
              error
                ? "bg-red-50 border-2 border-red-300 text-red-700"
                : "bg-green-50 border-2 border-green-300 text-green-700"
            }`}
          >
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
                  <p className="text-lg font-bold mt-2 flex items-center justify-center gap-2">
                    <FaCheckCircle /> +₦{scanResult.reward} added!
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
            className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 transition-all font-semibold flex items-center gap-2 mx-auto shadow-md hover-lift"
          >
            <FaTrashAlt /> Report Illegal Dump
          </button>
        </div>

        {/* Report Modal */}
        {showReport && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
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
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
              <div className="flex gap-3">
                <button
                  onClick={reportDump}
                  className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-accent font-medium transition"
                >
                  Submit
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white py-2 rounded-lg font-medium transition"
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
            className="text-accent hover:underline font-medium text-lg transition"
          >
            How to Recycle
          </button>
        </div>

        {/* Toast */}
        {toast && (
          <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </section>
  );
}
