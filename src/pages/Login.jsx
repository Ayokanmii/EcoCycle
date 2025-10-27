// src/pages/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.svg"; // Add your logo

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      let errorMsg = "Login failed. Please try again.";
      switch (err.code) {
        case "auth/user-not-found":
          errorMsg = "No account found with this email.";
          break;
        case "auth/wrong-password":
          errorMsg = "Incorrect password.";
          break;
        case "auth/invalid-credential":
          errorMsg = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMsg = "Too many attempts. Try again later.";
          break;
        case "auth/network-request-failed":
          errorMsg = "Network error. Check your connection.";
          break;
        default:
          errorMsg = "An unexpected error occurred.";
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-Contains flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fadeIn">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={logo} 
              alt="EcoCycle Logo" 
              className="h-16 w-16"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="hidden text-6xl">Recycle</div>
          </div>
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to continue recycling and earning in Ogun State</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg transition shadow-md hover:shadow-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Signing in...
              </span>
            ) : (
              "Login to Dashboard"
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
            {error}
          </div>
        )}

        {/* Links */}
        <div className="mt-6 text-center space-y-3 text-sm">
          <Link to="/forgot-password" className="block text-accent hover:underline font-medium">
            Forgot your password?
          </Link>
          <p className="text-gray-600">
            New to EcoCycle?{" "}
            <Link to="/register" className="text-accent hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-10">
          © 2025 EcoCycle • 3MTT Cohort 3 • Ogun State Greentech
        </p>
      </div>
    </div>
  );
}