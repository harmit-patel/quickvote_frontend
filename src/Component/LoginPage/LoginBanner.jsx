import React from "react";

const LoginBanner = () => {
  return (
    <div className="h-48 flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 relative">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h2 className="text-white text-2xl font-bold">Secure Login</h2>
        <p className="text-white text-opacity-80 max-w-xs mx-auto mt-2">Enter your email to receive a one-time password</p>
      </div>
    </div>
  );
};

export default LoginBanner;