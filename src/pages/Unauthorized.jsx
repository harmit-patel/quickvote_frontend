import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/');
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
            <div className="flex flex-col items-center justify-center w-full p-8">
                {/* Background animation elements */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                
                {/* Main content container */}
                <div className="relative z-10 max-w-2xl w-full">
                    {/* Error icon with gradient background */}
                    <div className="mx-auto w-32 h-32 relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500 rounded-full opacity-20 blur-md"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Content card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all hover:shadow-2xl">
                        {/* Top gradient bar */}
                        <div className="h-2 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500"></div>
                        
                        <div className="px-8 py-10">
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-700 mb-2 text-center">
                                Unauthorized Access
                            </h1>
                            
                            <div className="h-1 w-32 bg-gradient-to-r from-rose-400 to-fuchsia-500 mx-auto my-4"></div>
                            
                            <p className="text-lg text-center text-indigo-900 mb-8">
                                You don't have permission to view this page. Please sign in with an authorized account.
                            </p>
                            
                            <div className="flex justify-center">
                                <button 
                                    onClick={handleGoBack}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                                >
                                    <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                                    <span className="relative flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                        Return to Login
                                    </span>
                                </button>
                            </div>
                        </div>
                        
                        {/* Bottom decoration */}
                        <div className="relative h-1.5 bg-gray-100">
                            <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>
                        </div>
                    </div>
                    
                    {/* Additional info text */}
                    <p className="text-sm text-center text-indigo-600 mt-6 px-4 py-2 bg-white/30 backdrop-blur-sm rounded-lg shadow-sm">
                        If you believe this is an error, please contact your administrator for assistance.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;