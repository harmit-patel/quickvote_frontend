import React from 'react';

const DashboardShimmer = () => {
    // Create multiple shimmer cards for better loading experience
    const shimmerCards = Array.from({ length: 6 }, (_, index) => index);
    const previousShimmerItems = Array.from({ length: 4 }, (_, index) => index);

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
            {/* Sidebar Shimmer */}
            <aside className="w-64 bg-gradient-to-b from-violet-700 via-indigo-700 to-purple-800 shadow-xl">
                <div className="flex flex-col items-center py-8 px-4 space-y-6 h-full">
                    {/* Profile Image Shimmer */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-75 blur-md animate-pulse"></div>
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-white/20 animate-pulse border-4 border-white"></div>
                        </div>
                    </div>
                    
                    {/* Email Shimmer */}
                    <div className="text-center mt-4 w-full">
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <div className="h-4 bg-white/30 rounded animate-pulse"></div>
                        </div>
                    </div>
                    
                    {/* Logout Button Shimmer */}
                    <div className="mt-auto w-full">
                        <div className="py-3 px-4 bg-white/20 rounded-lg animate-pulse"></div>
                    </div>
                </div>
            </aside>

            {/* Main Content Shimmer */}
            <main className="flex-1 p-8">
                {/* Header Shimmer */}
                <div className="mb-10 relative">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    
                    <div className="h-10 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                    <div className="h-1 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                </div>
                
                {/* Live Polls Section Shimmer */}
                <section className="mb-12 relative">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    
                    {/* Section Title Shimmer */}
                    <div className="flex items-center mb-6">
                        <div className="mr-3 bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg w-12 h-12 animate-pulse"></div>
                        <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Survey Cards Grid Shimmer */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shimmerCards.map((_, index) => (
                            <div key={index} className="relative overflow-hidden bg-white rounded-xl shadow-lg">
                                {/* Top gradient line shimmer */}
                                <div className="h-2 w-full bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                                
                                {/* Priority tag shimmer */}
                                {index % 3 === 0 && (
                                    <div className="absolute top-4 right-4 z-10">
                                        <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                                    </div>
                                )}
                                
                                <div className="p-6">
                                    {/* Title shimmer */}
                                    <div className="mb-3">
                                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-2"></div>
                                        <div className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    
                                    {/* Time left shimmer */}
                                    <div className="flex items-center mb-2">
                                        <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mr-2"></div>
                                        <div className="h-6 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    
                                    {/* Survey ID shimmer */}
                                    <div className="flex items-center mb-4">
                                        <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mr-2"></div>
                                        <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                    </div>
                                    
                                    {/* Status and action buttons shimmer */}
                                    <div className="flex items-center justify-between">
                                        <div className="h-8 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                                        <div className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                                
                                {/* Bottom progress bar shimmer */}
                                <div className="h-1.5 bg-gray-100">
                                    <div className="h-full w-1/3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Status Guide Shimmer */}
                <div className="mb-8 rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-300 to-gray-400 px-4 py-2 animate-pulse">
                        <div className="h-5 w-40 bg-white/30 rounded animate-pulse"></div>
                    </div>
                    <div className="bg-white p-4">
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-full animate-pulse">
                                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2 animate-pulse"></div>
                                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            
                            <div className="flex items-center bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-full animate-pulse">
                                <div className="w-3 h-3 rounded-full bg-gray-300 mr-2 animate-pulse"></div>
                                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                            
                            <div className="flex items-center ml-auto bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1.5 rounded-full animate-pulse">
                                <div className="w-4 h-4 mr-1 bg-gray-300 rounded animate-pulse"></div>
                                <div className="h-4 w-32 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previous Surveys Section Shimmer */}
                <section className="relative">
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-fuchsia-300 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    
                    {/* Section Title Shimmer */}
                    <div className="flex items-center mb-6">
                        <div className="mr-3 bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg w-12 h-12 animate-pulse"></div>
                        <div className="h-7 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                    </div>
                    
                    {/* Previous Surveys List Shimmer */}
                    <div className="bg-white rounded-xl shadow overflow-hidden relative">
                        {/* Decorative corner shimmer */}
                        <div className="absolute top-0 right-0 w-20 h-20">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gray-200 via-gray-100 to-transparent rounded-bl-full opacity-50 animate-pulse"></div>
                        </div>
                        
                        <ul className="divide-y divide-gray-100">
                            {previousShimmerItems.map((_, index) => (
                                <li key={index} className="flex items-center justify-between p-5">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
                                        <div>
                                            <div className="h-5 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse mb-1"></div>
                                            <div className="h-4 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="h-6 w-28 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse"></div>
                                        <div className="w-5 h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded ml-2 animate-pulse"></div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default DashboardShimmer;