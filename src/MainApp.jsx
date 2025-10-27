// src/MainApp.jsx
import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "./firebase";
import EcoCycleCore from "./components/EcoCycleCore";
import Map from "./components/Map";
import logo from "./assets/logo.svg";
import {
  FaRecycle,
  FaCoins,
  FaUsers,
  FaMapMarkedAlt,
  FaGlobe,
  FaLeaf,
  FaTrophy,
  FaCircle,
  FaCamera,
} from "react-icons/fa";

// ---------------------------------------------------------------------
// 1. i18n (unchanged)
// ---------------------------------------------------------------------
const LANGUAGES = [
  { code: "en", name: "English", flag: "GB" },
  { code: "yo", name: "Yoruba", flag: "NG" },
  { code: "ig", name: "Igbo", flag: "NG" },
  { code: "ha", name: "Hausa", flag: "NG" },
];

const TRANSLATIONS = { /* …your translations – unchanged… */ };

// ---------------------------------------------------------------------
// 2. Tiny toast helper
// ---------------------------------------------------------------------
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

// ---------------------------------------------------------------------
// 3. API helper (only the parts we need here)
// ---------------------------------------------------------------------
const API_URL = "https://ecocycle-backend.onrender.com"; // <-- YOUR BACKEND

const classifyAndReward = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_URL}/classify`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

const addRewardToWallet = async (uid, amount) => {
  const token = await auth.currentUser.getIdToken();
  const res = await fetch(`${API_URL}/wallet/${uid}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

// ---------------------------------------------------------------------
// 4. Main component
// ---------------------------------------------------------------------
export default function MainApp() {
  const [lang, setLang] = useState("en");
  const [stats, setStats] = useState({ recycled: 0, earnings: 0, users: 0, carbon: 0 });
  const [wallet, setWallet] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [scanFile, setScanFile] = useState(null);
  const [scanning, setScanning] = useState(false);

  const t = TRANSLATIONS[lang];

  // -----------------------------------------------------------------
  // Firestore listeners (unchanged)
  // -----------------------------------------------------------------
  useEffect(() => {
    const unsubs = [];

    const statsRef = doc(db, "global", "stats");
    unsubs.push(
      onSnapshot(statsRef, (doc) => {
        if (doc.exists()) setStats(doc.data());
      })
    );

    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      unsubs.push(
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) setWallet(doc.data().wallet || 0);
        })
      );
    }

    const now = Date.now();
    const fiveMinsAgo = now - 5 * 60 * 1000;
    const onlineQuery = query(
      collection(db, "users"),
      where("lastActive", ">=", fiveMinsAgo)
    );
    unsubs.push(
      onSnapshot(onlineQuery, (snap) => {
        setOnlineUsers(snap.size);
      })
    );

    setLoading(false);
    return () => unsubs.forEach((u) => u());
  }, []);

  // -----------------------------------------------------------------
  // Scan → AI → Reward
  // -----------------------------------------------------------------
  const handleScan = async () => {
    if (!scanFile) return;
    setScanning(true);
    try {
      const data = await classifyAndReward(scanFile);
      if (data.recyclable) {
        const uid = auth.currentUser.uid;
        await addRewardToWallet(uid, data.estimated_reward);
        setWallet((w) => w + data.estimated_reward);
        setToast({
          msg: `+₦${data.estimated_reward} added! (${data.class})`,
          type: "success",
        });
      } else {
        setToast({ msg: `Non‑recyclable (${data.class})`, type: "error" });
      }
    } catch (e) {
      setToast({ msg: "Scan failed – try again", type: "error" });
    } finally {
      setScanning(false);
      setScanFile(null);
    }
  };

  // -----------------------------------------------------------------
  // UI cards (unchanged)
  // -----------------------------------------------------------------
  const cards = [
    { icon: <FaRecycle />, value: `${stats.recycled} tons`, label: t.recycled, color: "bg-green-100" },
    { icon: <FaCoins />, value: `₦${stats.earnings.toLocaleString()}`, label: t.earned, color: "bg-yellow-100" },
    { icon: <FaUsers />, value: stats.users.toLocaleString(), label: t.users, color: "bg-blue-100" },
    { icon: <FaMapMarkedAlt />, value: t.live, label: t.dumps, color: "bg-red-100" },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 dark:from-gray-900 dark:to-gray-800">
      {/* Top banner */}
      <div className="bg-gradient-to-r from-yellow-400 to-green-500 text-white py-2 px-6 text-center font-bold text-sm">
        <FaTrophy className="inline mr-2" /> {t.greentech}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Language selector */}
        <div className="flex justify-end mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex gap-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  lang === l.code
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {l.flag === "GB" ? "EN" : l.name}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-12">
          <img src={logo} alt="EcoCycle" className="h-20 w-20 mx-auto mb-6 animate-spin-slow" />
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
            {t.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed animate-fadeIn delay-300 max-w-4xl mx-auto">
            <strong className="text-accent">EcoCycle</strong> {t.subtitle}
          </p>
          <p className="text-lg md:text-xl text-gray-600 mt-6 animate-fadeIn delay-600">{t.stats}</p>
          <p className="text-base md:text-lg text-gray-500 mt-8 italic animate-fadeIn delay-900">
            {t.tagline}
          </p>
        </div>

        {/* Wallet + Online */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-md mx-auto">
          <div className="bg-primary text-white p-6 rounded-xl shadow-lg hover-lift text-center">
            <p className="text-sm opacity-90">{t.wallet}</p>
            <p className="text-4xl font-bold">₦{wallet.toLocaleString()}</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-6 rounded-xl shadow-lg hover-lift text-center flex items-center justify-center gap-3">
            <FaCircle className="text-green-300 animate-pulse" />
            <div>
              <p className="text-sm opacity-90">{t.online}</p>
              <p className="text-2xl font-bold">{onlineUsers}</p>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {cards.map((card, i) => (
            <div
              key={i}
              className={`${card.color} p-5 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 animate-fadeIn text-center`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="text-lg font-bold text-gray-800">{card.value}</p>
              <p className="text-xs text-gray-600">{card.label}</p>
            </div>
          ))}
          <div className="bg-teal-100 p-5 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 animate-fadeIn text-center">
            <FaLeaf className="text-teal-600 text-3xl mb-2 mx-auto" />
            <p className="text-lg font-bold text-gray-800">{(stats.carbon || 0).toFixed(1)}t</p>
            <p className="text-xs text-gray-600">{t.carbon}</p>
          </div>
        </div>

        {/* Scan + Map */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* ---- SCAN SECTION ---- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
              <FaCamera /> {t.scan}
            </h2>

            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => setScanFile(e.target.files[0])}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-accent"
              />

              <button
                onClick={handleScan}
                disabled={!scanFile || scanning}
                className="w-full bg-primary text-white py-3 rounded-xl hover:bg-accent disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
              >
                {scanning ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>Scan & Earn</>
                )}
              </button>
            </div>

            {/* Optional: show last result */}
            {/* <EcoCycleCore lang={lang} /> */}
          </div>

          {/* ---- MAP SECTION ---- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.map}</h2>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <Map />
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
