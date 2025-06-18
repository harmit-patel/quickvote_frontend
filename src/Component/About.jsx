import React from 'react';

const About = () => {
  return (
    <section
      className="relative w-full py-20 bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden"
      id="about"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-blue-400 opacity-20 blur-[150px] animate-pulse rounded-full top-[-100px] left-[-100px]"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-400 opacity-30 blur-[150px] animate-pulse rounded-full bottom-[-150px] right-[-100px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-700 tracking-wide">
            Why QuickVote?
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto mt-4 mb-6 rounded"></div>
          <p className="text-lg text-gray-600">
            A platform you can trust.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '100%', label: 'Secure' },
            { value: '24/7', label: 'Availability' },
            { value: '99.9%', label: 'Accuracy' },
            { value: '5 min', label: 'Setup Time' },
          ].map((stat, index) => (
            <div
              key={index}
              className="group bg-white bg-opacity-30 backdrop-blur-md p-6 rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl relative"
            >
              {/* Gradient Border Animation */}
              <div className="absolute inset-0 border-2 border-transparent rounded-3xl bg-gradient-to-br from-blue-300 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative">
                <span className="block text-5xl font-extrabold text-blue-700 mb-2 transition-transform duration-300 group-hover:scale-110">
                  {stat.value}
                </span>
                <span className="block text-gray-600 text-lg">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
