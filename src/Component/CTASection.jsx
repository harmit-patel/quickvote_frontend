import React from 'react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="relative w-full py-20 bg-gradient-to-r from-blue-100 to-purple-100 overflow-hidden">
      {/* Animated Background Lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-blue-400 opacity-20 blur-[150px] animate-pulse rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-400 opacity-30 blur-[150px] animate-pulse rounded-full bottom-[-150px] right-[-100px]"></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-6 tracking-wide">
          Ready to modernize your voting process?
        </h2>

        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
          Join thousands of organizations already using{' '}
          <span className="font-semibold text-blue-600">QuickVote</span>
        </p>

        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="px-8 py-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Get Started
          </Link>

          {/* Learn More: scroll to section */}
          <a
            href="#how-it-works"
            className="px-8 py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-semibold rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
