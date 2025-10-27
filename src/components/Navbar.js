// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";
import logo from "../assets/logo.svg";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // ← FOR ACTIVE LINK

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const navItems = [
    { name: "Impact", path: "/impact" },
    { name: "Team", path: "/team" },
    { name: "Resources", path: "/resources" },
    { name: "How to Recycle", path: "/how-to-recycle" },
    { name: "Settings", path: "/settings" }, // ← ADDED
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logo} 
              alt="EcoCycle" 
              className="h-10 w-10 animate-spin-slow group-hover:animate-none transition"
            />
            <span className="text-2xl font-bold text-primary dark:text-green-400">
              EcoCycle
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isActive(item.path)
                    ? "bg-primary text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="ml-2 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition font-medium shadow-md"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-700 dark:text-gray-300 p-2"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-lg font-medium transition ${
                  isActive(item.path)
                    ? "bg-primary text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-medium"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}