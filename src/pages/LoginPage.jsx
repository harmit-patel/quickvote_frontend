import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../APIs/adminAPI";
import Loginfig from "../Assets/logingif1.png"
import { jwtDecode } from "jwt-decode";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginAdmin(email, password);

      if (response.status === "success") {
        const token = response.token;
        localStorage.setItem("token", token); // Store JWT

        const decoded = jwtDecode(token);
        const role = decoded.role;

        // Navigate based on role
        if (role === "admin") {
          navigate("/admindashboard");
        } else if (role === "superAdmin") {
          navigate("/superadmindashboard");
        } else {
          setError("Unauthorized role");
        }
      } else {
        setError(response.message || "Invalid credentials.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

// Handler for back button
const handleGoBack = () => {
  navigate('/', { replace: true }); // Always go to landing page
};


  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center px-4">
      <div className="flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-4xl">
        {/* Form Section - Full width on mobile, half on desktop */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center text-blue-600 hover:text-blue-800 transition mb-4"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-700 mb-3 md:mb-4 text-center">
            LOGIN
          </h1>
          <p className="text-center text-gray-500 mb-4 md:mb-6 text-sm md:text-base">
            Login to access your dashboard.
          </p>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 bg-red-100 border-l-4 border-red-500 text-sm p-2 rounded-md mb-4">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <input
                type="email"
                id="email"
                placeholder="Your email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <span className="absolute left-3 top-3.5 text-gray-400">
                📧
              </span>
            </div>

            {/* Password Input with Show/Hide functionality */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute left-3 top-3.5 text-gray-400">
                🔒
              </span>
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot Password & Register Links */}
            <div className="flex justify-between items-center text-sm text-gray-600">
              <Link to="/register" className="hover:text-blue-500 transition">
                Not a user? Register now
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
            >
              Login Now
            </button>
          </form>
        </div>

        {/* Image Section - Hidden on small screens, visible on medium and up */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 justify-center items-center p-6">
          <div className="relative w-3/4">
            <img
              src={Loginfig}
              alt="Login illustration"
              className="rounded-2xl shadow-lg"
            />
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full shadow-md animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-white rounded-full shadow-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;