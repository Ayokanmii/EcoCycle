// src/pages/Register.jsx
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import logo from "../assets/logo.svg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Password strength
  const getPasswordStrength = () => {
    if (password.length === 0) return { level: 0, text: "" };
    if (password.length < 6) return { level: 1, text: "Too short" };
    if (password.length < 8) return { level: 2, text: "Weak" };
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return { level: 4, text: "Strong" };
    return { level: 3, text: "Medium" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Client-side validation
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      let errorMsg = "Registration failed. Please try again.";
      switch (err.code) {
        case "auth/email-already-in-use":
          errorMsg = "This email is already registered. Try logging in.";
          break;
        case "auth/invalid-email":
          errorMsg = "Invalid email format.";
          break;
        case "auth/weak-password":
          errorMsg = "Password is too weak. Use 6+ characters.";
          break;
        case "auth/network-request-failed":
          errorMsg = "Network error. Check your internet connection.";
          break;
        case "auth/too-many-requests":
          errorMsg = "Too many attempts. Please try again later.";
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
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
          <h1 className="text-3xl font-bold text-primary">Create Account</h1>
          <p className="text-gray-600 mt-2">Join 1,247+ recyclers earning in Ogun State</p>
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
                placeholder="6+ characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
                autoComplete="new-password"
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        strength.level >= level
                          ? level <= 2 ? "bg-red-500" : level === 3 ? "bg-yellow-500" : "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs font-medium ${
                  strength.level <= 2 ? "text-red-600" : strength.level === 3 ? "text-yellow-600" : "text-green-600"
                }`}>
                  {strength.text}
                </span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || password.length < 6}
            className="w-full bg-primary text-white py-3.5 rounded-xl hover:bg-accent disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                <FaCheck /> Create Account
              </>
            )}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm animate-shake">
            {error}
          </div>
        )}

        {/* Login Link */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:underline font-medium">
            Login here
          </Link>
        </p>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-10">
          © 2025 EcoCycle • 3MTT Cohort 3 • Ogun State Greentech
        </p>
      </div>
    </div>
  );
}