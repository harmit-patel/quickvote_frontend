import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-purple-700 shadow-md fixed w-full z-50">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 relative z-10">
        <ul className="flex justify-between items-center">
          {/* Logo */}
          <li>
            <a
              href="/"
              className="group flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 hover:border-white/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-500 ease-out transform hover:scale-105"
            >
              <div className="relative">
                <img
                  src="/QuickVote_logo.png"
                  alt="QuickVote Logo"
                  className="h-8 w-13 drop-shadow-lg group-hover:drop-shadow-xl transition-all duration-300"
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                QuickVote
              </span>
              <div className="h-6 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
            </a>
          </li>
          {/* Navigation Links */}
          <div className="flex space-x-8">
            <li>
              <a
                href="#how-it-works"
                className="text-white font-semibold hover:text-[#FFD700] transition-all duration-300 hover:scale-110"
              >
                How it Works
              </a>
            </li>
            <li>
              <a
                href="#why-choose-us"
                className="text-white font-semibold hover:text-[#FFD700] transition-all duration-300 hover:scale-110"
              >
                Why Choose Us
              </a>
            </li>
            <li>
             <Link
  to="/login"
  className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
>
                Login
 </Link>             
            </li>
          </div>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
