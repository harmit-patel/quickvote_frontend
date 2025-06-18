import React from 'react';

const Features = () => {
    const features = [
        {
            icon: 'fas fa-shield-alt',
            title: 'Secure Voting',
            description: 'End-to-end encryption ensures your vote is safe and tamper-proof.',
            color: 'from-blue-100 to-blue-300',
        },
        {
            icon: 'fas fa-check-circle',
            title: 'Verified Results',
            description: 'Transparent process to confirm your vote was recorded correctly.',
            color: 'from-purple-100 to-purple-300',
        },
        {
            icon: 'fas fa-globe',
            title: 'Accessible Anywhere',
            description: 'Cast your vote securely from any location with internet access.',
            color: 'from-indigo-100 to-indigo-300',
        },
        {
            icon: 'fas fa-chart-line',
            title: 'Real-Time Analytics',
            description: 'Get instant insights and analytics on survey results.',
            color: 'from-blue-100 to-blue-300',
        },
        {
            icon: 'fas fa-user-friends',
            title: 'User-Friendly Interface',
            description: 'Easy-to-use interface for both participants and admins.',
            color: 'from-purple-100 to-purple-300',
        },
        {
            icon: 'fas fa-cogs',
            title: 'Customizable Surveys',
            description: 'Create and customize surveys to fit your needs.',
            color: 'from-indigo-100 to-indigo-300',
        },
    ];

    return (
        <section className="relative w-full py-20 bg-gradient-to-r from-blue-50 to-purple-50 overflow-hidden">
            {/* Background Light Animation */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-blue-400 opacity-20 blur-[150px] animate-pulse rounded-full top-[-150px] left-[-100px]"></div>
                <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-30 blur-[150px] animate-pulse rounded-full bottom-[-150px] right-[-100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-blue-700 tracking-wide">
                    Why Choose Us?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`bg-gradient-to-br ${feature.color} p-8 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}
                        >
                            <div className="text-5xl mb-6 text-blue-700">
                                <i className={feature.icon}></i>
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 tracking-wide text-gray-800">
                                {feature.title}
                            </h3>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
