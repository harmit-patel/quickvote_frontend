import React, { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { registerUser } from "../APIs/registerApi";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    institutionName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    fixedDomain: "",
  });

  const [errors, setErrors] = useState({
    password: [],
    confirmPassword: [],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [animationState, setAnimationState] = useState({
    leftBgPos: 0,
    rightBgPos: 0,
  });
  
  // Circle animation state
  const [circleScale, setCircleScale] = useState(1);
  const [circleOpacity, setCircleOpacity] = useState(0.1);

  // Animation effect for background elements
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationState(prev => ({
        leftBgPos: (prev.leftBgPos + 1) % 360,
        rightBgPos: (prev.rightBgPos - 1) % 360,
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  // New effect for circle animation
  useEffect(() => {
    const circleInterval = setInterval(() => {
      setCircleScale(prev => prev === 1 ? 1.3 : 1);
      setCircleOpacity(prev => prev === 0.1 ? 0.25 : 0.1);
    }, 1000); // 1 second interval for more noticeable blink
    
    return () => clearInterval(circleInterval);
  }, []);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters long");
    if (!/[A-Z]/.test(password)) errors.push("Must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("Must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("Must contain at least one number");
    if (!/[!@#$%^&*]/.test(password)) errors.push("Must contain at least one special character (!@#$%^&*)");
    return errors;
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
    if (fieldName === "phoneNumber" && !formData.phoneNumber.startsWith("+91 ")) {
      setFormData(prev => ({ ...prev, phoneNumber: "+91 " }));
    }
    if (fieldName === "fixedDomain" && !formData.fixedDomain.includes("@")) {
      setFormData(prev => ({ ...prev, fixedDomain: "@" }));
    }
  };

  const handleBlur = (fieldName) => {
    setFocusedField(null);
    if (fieldName === "phoneNumber" && formData.phoneNumber === "+91 ") {
      setFormData(prev => ({ ...prev, phoneNumber: "" }));
    }
    if (fieldName === "fixedDomain" && formData.fixedDomain === "@") {
      setFormData(prev => ({ ...prev, fixedDomain: "" }));
    }
  };

  // Function to handle phone number input validation and formatting
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    
    // Ensure the phone number always starts with "+91 "
    let processedInput = input;
    if (!input.startsWith("+91 ")) {
      processedInput = "+91 " + input.replace(/^\+91\s*/, "");
    }
    
    // Extract just the part after "+91 "
    const numberPart = processedInput.substring(4);
    
    // Replace any non-digit with empty string in the number part
    const digitsOnly = numberPart.replace(/\D/g, "");
    
    // Limit to 10 digits after the prefix
    const limitedDigits = digitsOnly.substring(0, 10);
    
    // Set the formatted number
    setFormData(prev => ({
      ...prev,
      phoneNumber: "+91 " + limitedDigits
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // Use the specialized function for phone number
      handlePhoneNumberChange(e);
      return;
    } else if (name === "fixedDomain") {
      setFormData(prev => ({
        ...prev,
        [name]: value.startsWith("@") ? value : "@" + value,
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (name === "password") {
      const passwordErrors = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: passwordErrors,
        confirmPassword: value !== formData.confirmPassword ? ["Passwords do not match"] : [],
      }));
    }

    if (name === "confirmPassword") {
      setErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.password ? ["Passwords do not match"] : [],
      }));
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setServerMessage(null); // Clear previous messages

  if (formData.password !== formData.confirmPassword) {
    setErrors(prev => ({
      ...prev,
      confirmPassword: ["Passwords do not match"],
    }));
    setIsLoading(false);
    return;
  }

  const dataToSend = {
    institutionName: formData.institutionName,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    password: formData.password,
    fixedDomain: formData.fixedDomain,
  };

  console.log("Submitting data:", dataToSend);

  try {
    const response = await fetch("http://localhost:8080/api/admins/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    const result = await response.json(); // Parse JSON response

    if (response.status === 409) {
      // Conflict: Admin with this email already exists
      setServerMessage(result.message);
    } else if (!response.ok) {
      // Handle specific server errors based on status code or message
      let errorMessage = "Registration failed.";
      if (result && result.message) {
        errorMessage = result.message;
      } else {
        errorMessage += ` Server responded with status: ${response.status}`;
      }
      setServerMessage(errorMessage);
    } else {
      // Registration successful
      setServerMessage(result.message);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    console.error("Error details:", error.response?.data || error.message);
    let userFriendlyError = "An error occurred during registration. Please check your network connection and try again.";
    if (error.message.includes("Failed to fetch")) {
      userFriendlyError = "Failed to connect to the server. Please check your internet connection.";
    } else if (error.message.includes("JSON")) {
      userFriendlyError = "An admin with this email already exists.";
    }
    setServerMessage(userFriendlyError);
  } finally {
    setIsLoading(false);
  }
};

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-blue-400 opacity-20 blur-3xl rounded-full top-0 -left-40 animate-pulse"
          style={{ 
            transform: `rotate(${animationState.leftBgPos}deg)`,
            transformOrigin: 'center',
          }}
        ></div>
        <div 
          className="absolute w-96 h-96 bg-purple-400 opacity-20 blur-3xl rounded-full bottom-0 -right-40 animate-pulse"
          style={{ 
            transform: `rotate(${animationState.rightBgPos}deg)`,
            transformOrigin: 'center',
          }}
        ></div>
      </div>

      {/* Back Button - Improved positioning */}
      <div className="w-full max-w-4xl mb-4 flex justify-start">
        <button 
          onClick={navigateToLogin}
          className="flex items-center py-2 px-4 bg-white rounded-lg shadow-md text-gray-700 hover:bg-gray-100 transition-colors z-20 hover:shadow-lg"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Login
        </button>
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden relative z-10 hover:shadow-2xl transition-shadow duration-300">
        {/* Enhanced left side illustration with animations */}
        <div className="md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 flex items-center justify-center relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="absolute w-64 h-64 rounded-full bg-white opacity-5 -top-20 -left-20 animate-blob"></div>
            <div className="absolute w-96 h-96 rounded-full bg-white opacity-5 -bottom-40 -right-40 animate-blob animation-delay-2000"></div>
            
            {/* Modified circle with improved animation */}
            <div 
              className="absolute w-32 h-32 rounded-full bg-blue-300 top-1/4 right-10"
              style={{
                opacity: circleOpacity,
                transform: `scale(${circleScale})`,
                transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
                boxShadow: circleScale === 1.3 ? "0 0 20px 5px rgba(147, 197, 253, 0.4)" : "none"
              }}
            ></div>
            
            <div className="absolute w-20 h-20 rounded-full bg-purple-300 opacity-10 bottom-1/4 left-10 animate-ping"></div>
            
            {/* Abstract wave patterns with animation */}
            <svg className="absolute bottom-0 left-0 w-full opacity-10 animate-wave" style={{ animationDuration: '20s' }} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,208C672,213,768,203,864,170.7C960,139,1056,85,1152,80C1248,75,1344,117,1392,138.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg className="absolute top-0 left-0 w-full opacity-10 animate-wave-reverse" style={{ animationDuration: '25s' }} viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,133.3C672,139,768,181,864,208C960,235,1056,245,1152,218.7C1248,192,1344,128,1392,96L1440,64L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
            </svg>
          </div>
          
          <div className="text-center relative z-10">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-3 animate-fadeIn">Welcome!</h2>
            <p className="text-blue-100 mb-4 max-w-xs mx-auto">Join thousands of institutions already using our platform</p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center text-white text-sm bg-white bg-opacity-10 p-3 rounded-lg transform hover:translate-x-2 transition-transform duration-300">
                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Secure and reliable platform
              </div>
              
              <div className="flex items-center text-white text-sm bg-white bg-opacity-10 p-3 rounded-lg transform hover:translate-x-2 transition-transform duration-300">
                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Easy to set up and manage
              </div>
              
              <div className="flex items-center text-white text-sm bg-white bg-opacity-10 p-3 rounded-lg transform hover:translate-x-2 transition-transform duration-300">
                <svg className="w-5 h-5 mr-3 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Fast and responsive support
              </div>
            </div>
          </div>
        </div>

        {/* Right side form with static fields (hover effects removed) */}
        <div className="md:w-1/2 p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Registration Form</h2>
            <p className="text-gray-500 text-sm mt-1">Create your institution account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
              <input
                id="institutionName"
                type="text"
                name="institutionName"
                placeholder="Enter your institution name"
                required
                value={formData.institutionName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                placeholder="Enter phone number (e.g., 9876543210)"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                onFocus={() => handleFocus("phoneNumber")}
                onBlur={() => handleBlur("phoneNumber")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <p className="text-xs text-gray-500 mt-1">Indian mobile number (10 digits)</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password.length > 0 && (
                <div className="mt-2 space-y-1">
                  {errors.password.map((error, index) => (
                    <p key={index} className="text-xs text-red-600 flex items-center">
                      <span className="inline-block w-1 h-1 rounded-full bg-red-600 mr-2"></span>
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword.length > 0 && (
                <div className="mt-2">
                  {errors.confirmPassword.map((error, index) => (
                    <p key={index} className="text-xs text-red-600">{error}</p>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="fixedDomain" className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
              <input
                id="fixedDomain"
                type="text"
                name="fixedDomain"
                placeholder="Enter your domain (e.g., yourcompany.com)"
                required
                value={formData.fixedDomain}
                onChange={handleChange}
                onFocus={() => handleFocus("fixedDomain")}
                onBlur={() => handleBlur("fixedDomain")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={errors.password.length > 0 || errors.confirmPassword.length > 0 || isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all transform hover:scale-105 ${
                errors.password.length > 0 || errors.confirmPassword.length > 0 || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
              } flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Register Now"}
            </button>
          </form>

          {serverMessage && (
            <div className={`mt-4 p-3 rounded-lg ${serverMessage.includes("error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"} animate-fadeIn`}>
              {serverMessage}
            </div>
          )}

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <button 
              onClick={navigateToLogin}
              className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors"
            >
              Log in here
            </button>
          </div>
        </div>
      </div>
      
      {/* Add style for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, 15px) scale(1.1); }
          50% { transform: translate(-15px, 10px) scale(0.9); }
          75% { transform: translate(15px, -20px) scale(1.05); }
        }
        
        @keyframes wave {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25px) translateY(10px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes wave-reverse {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(25px) translateY(-10px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-wave {
          animation: wave 15s ease-in-out infinite;
        }
        
        .animate-wave-reverse {
          animation: wave-reverse 20s ease-in-out infinite;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default RegistrationForm;