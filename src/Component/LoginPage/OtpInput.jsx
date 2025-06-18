import React from "react";

const OtpInput = ({ otp, setOtp, handleSubmit }) => {
  // Create refs for OTP inputs to handle focus movement
  const otpInputRefs = Array(6)
    .fill(0)
    .map(() => React.createRef());

  const handleOtpChange = (index, value) => {
    value = value.replace(/[^0-9]/g, ""); // Allow only numbers

    if (value || value === "") {
      const newOtp = otp.split("");
      newOtp[index] = value;
      setOtp(newOtp.join(""));

      // Auto-focus next input
      if (value && index < 5) {
        otpInputRefs[index + 1].current.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpInputRefs[index - 1].current.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      otpInputRefs[index - 1].current.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      otpInputRefs[index + 1].current.focus();
    } else if (e.key === "Enter") {
      e.preventDefault(); // Prevent accidental form submission
      handleSubmit(); // Call the submission function
    }
  };

  // Handle paste event for OTP
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);

    if (pasteData) {
      setOtp(pasteData.padEnd(6, "").slice(0, 6));

      // Focus last filled input or the first input if not enough characters
      const lastIndex = Math.min(pasteData.length - 1, 5);
      otpInputRefs[lastIndex].current.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2 mb-6">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={otpInputRefs[i]}
          className="w-10 h-12 rounded-lg border-2 border-gray-300 text-center text-xl font-bold text-blue-700 focus:border-blue-500 focus:outline-none transition-colors"
          type="text"
          maxLength="1"
          value={otp[i] || ""}
          onChange={(e) => handleOtpChange(i, e.target.value)}
          onKeyDown={(e) => handleOtpKeyDown(i, e)}
          onPaste={i === 0 ? handleOtpPaste : undefined}
          inputMode="numeric"
          autoComplete="one-time-code"
        />
      ))}
    </div>
  );
};

export default OtpInput;
