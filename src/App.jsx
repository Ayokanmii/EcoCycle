// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import Register from "./pages/Register";
import MainApp from "./MainApp";
import Impact from "./pages/Impact";
import Team from "./pages/Team";
import Resources from "./pages/Resources";
import HowToRecycle from "./pages/HowToRecycle";
import Settings from "./pages/Settings";
import Navbar from "./components/Navbar";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin h-12 w-12 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
        <Route path="/" element={user ? <MainApp /> : <Navigate to="/login" />} />
        <Route path="/impact" element={user ? <Impact /> : <Navigate to="/login" />} />
        <Route path="/team" element={user ? <Team /> : <Navigate to="/login" />} />
        <Route path="/resources" element={user ? <Resources /> : <Navigate to="/login" />} />
        <Route path="/how-to-recycle" element={user ? <HowToRecycle /> : <Navigate to="/login" />} />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;