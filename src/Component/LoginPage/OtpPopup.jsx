import React from "react";
import OtpInput from "./OtpInput";
import ErrorMessage from "./ErrorMessage";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

const OtpPopup = ({
  email,
  otp,
  setOtp,
  error,
  isLoading,
  countdown,
  handleClosePopup,
  handleLogin,
  handleGenerateOtp
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClosePopup}>
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md transform transition-all duration-300 animate-fadeIn relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={handleClosePopup}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Verify Email</h2>
            <p className="text-gray-600">
              Enter the 6-digit code sent to<br />
              <span className="font-semibold text-gray-800">{email}</span>
            </p>
          </div>
          
          <OtpInput otp={otp} setOtp={setOtp} />
          
          {error && <div className="text-center mb-4"><ErrorMessage error={error} /></div>}
          
          <div className="text-center text-sm text-gray-500 mb-6">
            {countdown > 0 ? (
              <span>Resend code in {countdown}s</span>
            ) : (
              <button 
                type="button" 
                onClick={handleGenerateOtp}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Resend OTP
              </button>
            )}
          </div>
          
          <button
            type="button"
            onClick={handleLogin}
            disabled={isLoading || otp.length !== 6}
            className={`w-full h-12 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] ${
              isLoading || otp.length !== 6
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Verifying...
              </>
            ) : (
              <>
                Continue
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;