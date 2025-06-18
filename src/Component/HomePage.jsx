import React from 'react';
import { Link } from 'react-router-dom';
import voteImage from '../Assets/ps2.png';

const HomePage = () => {
    return (
        <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 p-4">
            {/* Background Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-64 h-64 bg-blue-400 opacity-20 blur-3xl animate-pulse rounded-full top-0 left-0"></div>
                <div className="absolute w-64 h-64 bg-purple-400 opacity-30 blur-3xl animate-pulse rounded-full bottom-0 right-0"></div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center justify-center w-full relative z-10 py-16 md:py-24">
                {/* Left Section - Image (hidden on very small screens, shows below content on small screens) */}
                <div className="md:w-1/2 flex justify-center items-center mb-6 md:mb-0 order-2 md:order-1">
                    <img
                        src={voteImage}
                        alt="Vote Icon"
                        className="w-64 md:w-80 lg:w-96 transform transition-transform duration-500 hover:scale-110 drop-shadow-xl"
                    />
                </div>

                {/* Right Section - Content */}
                <div className="md:w-1/2 text-center md:text-left px-4 order-1 md:order-2">
                    <h3 className="text-lg md:text-xl font-medium text-gray-700 mb-2 tracking-wide">
                        Be a part of the decision
                    </h3>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-blue-700 mb-4 leading-tight">
                        Vote Today, Shape Tomorrow
                    </h1>

                    <p className="text-base md:text-lg text-gray-600 mb-6">
                        Make your voice count with our secure and easy-to-use voting platform.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Link
                            to="/loginparticipant"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            <i className="fas fa-user-circle"></i>
                            <span>Participant</span>
                        </Link>
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg mt-3 sm:mt-0"
                        >
                            <i className="fas fa-shield-alt"></i>
                            <span>Admin</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;