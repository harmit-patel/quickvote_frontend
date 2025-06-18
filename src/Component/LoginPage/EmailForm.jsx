import React from "react";
import Button from "./Button";
import ErrorMessage from "./ErrorMessage";

const EmailForm = ({ 
  email, 
  setEmail, 
  error, 
  handleGenerateOtp, 
  isOtpSending, 
  showReopenButton,
  reopenOtpPopup
}) => {
  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=" "
            autoComplete="email"
            className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors peer"
          />
          <label 
            htmlFor="email" 
            className={`absolute left-4 transition-all bg-white px-2 ${
              email ? 'text-xs text-blue-600 -top-2.5 left-2' : 'text-gray-500 top-3'
            }`}
          >
            Email address
          </label>
        </div>
        <p className="text-sm text-gray-500 pl-2">We'll send a 6-digit code to this email</p>
        {error && <ErrorMessage error={error} />}
      </div>

      <div className="flex flex-col space-y-3">
        {showReopenButton ? (
          <Button
            onClick={reopenOtpPopup}
            disabled={false}
            isLoading={false}
            text="Enter OTP Code"
          />
        ) : (
          <Button
            onClick={handleGenerateOtp}
            disabled={isOtpSending || !email.match(/^\S+@\S+\.\S+$/)}
            isLoading={isOtpSending}
            text="Get OTP"
          />
        )}
      </div>
    </form>
  );
};

export default EmailForm;