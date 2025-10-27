// src/MainApp.jsx
import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  setDoc,
  serverTimestamp,
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
  FaCheckCircle,
  FaExclamationTriangle,
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
      {type === "success" ? <FaCheckCircle /> : <FaExclamationTriangle />}
      {msg}
    </div>
  );
};

// ---------------------------------------------------------------
// 2. Language & Translations
// ---------------------------------------------------------------
const LANGUAGES = [
  { code: "en", name: "English", flag: "GB" },
  { code: "yo", name: "Yoruba", flag: "NG" },
  { code: "ig", name: "Igbo", flag: "NG" },
  { code: "ha", name: "Hausa", flag: "NG" },
];

const TRANSLATIONS = {
  en: {
    title: "Transforming Waste into Wealth",
    subtitle: "EcoCycle empowers communities in Ogun State to recycle waste, earn cash, and track illegal dumps all in one tap.",
    stats: "500 tons recycled. ₦37,200 paid. 1,247 active users.",
    tagline: "Powered by innovation. Driven by impact.",
    wallet: "Your Wallet",
    recycled: "Recycled",
    earned: "Total Earned",
    users: "Active Users",
    dumps: "Dump Reports",
    scan: "Scan & Earn",
    map: "Live Dump Reports",
    live: "Live",
    carbon: "CO₂ Saved",
    online: "Online Now",
    greentech: "Ogun Greentech Challenge",
  },
  yo: {
    title: "Sísọ Ìdọ̀tí Di Owó",
    subtitle: "EcoCycle fún àwọn ará Ogun lágbára láti ṣe atunlo ìdọ̀tí, gba owó, kí wọ́n sì tọ́jú àwọn ibi ìdọ̀tí tí kò tọ̀nà.",
    stats: "500 tọ́ọ̀nù ìdọ̀tí ni a tún ṣe. ₦37,200 ni a san. 1,247 olùmúlò.",
    tagline: "Agbára ìmọ̀-ẹ̀rọ. Ìtòlẹ́sẹẹsẹ ìpìlẹ̀.",
    wallet: "Apamọ́wọ́ Rẹ",
    recycled: "Tún Ṣe",
    earned: "Owó Gba",
    users: "Olùmúlò",
    dumps: "Ìròyìn Ìdọ̀tí",
    scan: "Wò & Gba",
    map: "Ìròyìn Ìdọ̀tí Láàyè",
    live: "Láàyè",
    carbon: "CO₂ Ti Fipamọ́",
    online: "Lórí Ayélujára",
    greentech: "Ìdíje Greentech Ogun",
  },
  ig: {
    title: "Gbanwee Ihe Mkpochapu Bụrụ Ego",
    subtitle: "EcoCycle na-enye ndị obodo Ogun ike ịmegharị ihe mkpofu, nweta ego, na soro ebe mkpofu iwu na-akwadoghị.",
    stats: "500 tọ́nụ̀ ihe mkpofu emegharịrị. ₦37,200 kwụrụ ụgwọ. Ndị ọrụ 1,247.",
    tagline: "Mee site na nkà na ụzụ. Mee ka mmetụta dị.",
    wallet: "Obere Akpa Gị",
    recycled: "Emegharịrị",
    earned: "Ego Enwetara",
    users: "Ndị Ọrụ",
    dumps: "Akụkọ Mkpochapu",
    scan: "Nyochaa & Nweta",
    map: "Akụkọ Mkpochapu Dị Ndụ",
    live: "Dị Ndụ",
    carbon: "CO₂ Echekwara",
    online: "Na Ntanetị",
    greentech: "Asọmpi Greentech Ogun",
  },
  ha: {
    title: "Juya Datti Zuwa Arziki",
    subtitle: "EcoCycle yana baiwa al'ummar Ogun damar sake amfani da datti, samun kuɗi, da kuma bin diddigin shara mara izini.",
    stats: "Tons 500 na sake amfani da datti. ₦37,200 aka aka. Masu amfani 1,247.",
    tagline: "Ƙirƙiri ta hanyar fasaha. Ƙarfafa tasiri.",
    wallet: "Walat ɗinka",
    recycled: "Sake Amfani",
    earned: "Kuɗin Samu",
    users: "Masu Amfani",
    dumps: "Rahoton Datti",
    scan: "Duba & Samu",
    map: "Rahoton Datti Kai Tsaye",
    live: "Kai Tsaye",
    carbon: "CO₂ An Ceci",
    online: "A Kan Layi",
    greentech: "Gasar Greentech ta Ogun",
  },
};

// ---------------------------------------------------------------
// 3. API Helper (for wallet sync)
// ---------------------------------------------------------------
const API_URL = import.meta.env.VITE_API_URL || "https://ecocycle-backend.onrender.com";

const addReward = async (uid, amount) => {
  if (!auth.currentUser) return;
  const token = await auth.currentUser.getIdToken();
  await fetch(`${API_URL}/wallet/${uid}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount }),
  });
};

// ---------------------------------------------------------------
// 4. Main App Component
// ---------------------------------------------------------------
export default function MainApp() {
  const [lang, setLang] = useState("en");
  const [stats, setStats] = useState({ recycled: 0, earnings: 0, users: 0, carbon: 0 });
  const [wallet, setWallet] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const t = TRANSLATIONS[lang];

  // -----------------------------------------------------------------
  // Real-time Firestore listeners
  // -----------------------------------------------------------------
  useEffect(() => {
    const unsubs = [];

    // Global stats
    const statsRef = doc(db, "global", "stats");
    unsubs.push(
      onSnapshot(statsRef, (doc) => {
        if (doc.exists()) setStats(doc.data());
      })
    );

    // User wallet
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      unsubs.push(
        onSnapshot(userRef, (doc) => {
          if (doc.exists()) setWallet(doc.data().wallet || 0);
        })
      );
    }

    // Online users (last 5 mins)
    const updateOnline = async () => {
      if (!auth.currentUser) return;
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { lastActive: Date.now() },
        { merge: true }
      );
    };

    updateOnline();
    const interval = setInterval(updateOnline, 30_000); // every 30s

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

    return () => {
      unsubs.forEach((u) => u());
      clearInterval(interval);
    };
  }, []);

  // -----------------------------------------------------------------
  // Pass reward to backend (called from EcoCycleCore)
  // -----------------------------------------------------------------
  const handleReward = async (amount) => {
    if (!auth.currentUser) return;
    try {
      await addReward(auth.currentUser.uid, amount);
      setToast({ msg: `+₦${amount} added!`, type: "success" });
    } catch (err) {
      setToast({ msg: "Wallet sync failed", type: "error" });
    }
  };

  // Expose via context or prop – here we pass via prop
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
      {/* Greentech Badge */}
      <div className="bg-gradient-to-r from-yellow-400 to-green-500 text-white py-2 px-6 text-center font-bold text-sm">
        <FaTrophy className="inline mr-2" /> {t.greentech}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 flex gap-1">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition flex items-center gap-1 ${
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
          <p className="text-lg md:text-xl text-gray-600 mt-6 animate-fadeIn delay-600">
            {t.stats}
          </p>
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

        {/* Stats + Carbon */}
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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.scan}</h2>
            <EcoCycleCore lang={lang} onReward={handleReward} />
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">{t.map}</h2>
            <div className="h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <Map />
            </div>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  );
}
