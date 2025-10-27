// src/pages/EcoCycle.jsx
import React, { useState, useRef, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import Map from "../components/Map";
import { FaCamera, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";

const EcoCycle = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // === CAMERA: Start Live Camera ===
  const startCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera in browser settings.");
      console.error(err);
    }
  };

  // === CAMERA: Capture Photo ===
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg");
      setPreview(dataUrl);
      setImage(dataUrl);
      stopCamera();
    }
  };

  // === CAMERA: Stop Stream ===
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  // === AI: Call Live Backend ===
  const classifyWaste = async () => {
    if (!image) {
      setError("Please capture or upload an image.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/classify`, {
        method: "POST",
        body: await fetch(image).then(r => r.blob()),
      });

      if (!res.ok) throw new Error("AI server error");

      const data = await res.json();
      setScanResult(data);

      setSuccess(`Scan complete! ${data.recyclable ? `Earn ₦${data.price_per_kg}/kg` : "Not recyclable"}`);
    } catch (err) {
      setError("AI scan failed. Try a clearer image.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === DROP-OFF: Save to Firebase ===
  const dropOffWaste = async () => {
    if (!scanResult) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "dropoffs"), {
        userId: auth.currentUser?.uid || "anonymous",
        wasteType: scanResult.class,
        pricePerKg: scanResult.price_per_kg,
        timestamp: serverTimestamp(),
        status: "confirmed",
        earnings: scanResult.price_per_kg,
      });

      setSuccess(`Drop-off confirmed! ₦${scanResult.price_per_kg} added to wallet.`);
      setImage(null);
      setPreview("");
      setScanResult(null);
    } catch (err) {
      setError("Failed to record drop-off.");
    } finally {
      setLoading(false);
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

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
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">Scan & Earn</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Camera / Upload */}
            <div className="space-y-4">
              {!cameraActive && !preview && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary transition"
                     onClick={() => document.getElementById("fileInput").click()}>
                  <FaCamera className="mx-auto text-4xl text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Click to upload</p>
                  <input id="fileInput" type="file" accept="image/*" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setImage(url);
                        setPreview(url);
                      }
                    }}
                  />
                </div>
              )}

              {/* Live Camera */}
              {cameraActive && (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
                  <button onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-accent">
                    <FaCamera />
                  </button>
                </div>
              )}

              {/* Preview */}
              {preview && (
                <div className="relative">
                  <img src={preview} alt="Preview" className="w-full rounded-lg" />
                  <button onClick={() => { setPreview(""); setImage(null); }}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full text-xs">×</button>
                </div>
              )}

              {/* Start Camera Button */}
              {!cameraActive && !preview && (
                <button onClick={startCamera}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2">
                  <FaCamera /> Open Camera
                </button>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button onClick={classifyWaste} disabled={loading || !image}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-accent transition disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <FaSpinner className="animate-spin" /> : "Scan Waste"}
              </button>

              <button onClick={dropOffWaste} disabled={loading || !scanResult}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                <FaCheckCircle /> Confirm Drop-Off
              </button>
            </div>
          </div>

          {/* Result */}
          {(error || success || scanResult) && (
            <div className={`mt-6 p-4 rounded-lg text-center font-medium ${
              error ? "bg-red-100 text-red-700" :
              success ? "bg-green-100 text-green-700" :
              "bg-blue-100 text-blue-700"
            }`}>
              {error && <span className="flex items-center justify-center gap-2"><FaExclamationTriangle /> {error}</span>}
              {success && <span className="flex items-center justify-center gap-2"><FaCheckCircle /> {success}</span>}
              {scanResult && !success && !error && (
                <div>
                  <strong className="text-green-600">{scanResult.class}</strong> 
                  ({Math.round(scanResult.confidence * 100)}% confidence)<br />
                  {scanResult.recyclable ? 
                    <span>Earn <strong className="text-yellow-600">₦{scanResult.price_per_kg}/kg</strong></span> :
                    <span className="text-red-600">Not recyclable</span>
                  }
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
    </section>
  );
};

export default EcoCycle;
