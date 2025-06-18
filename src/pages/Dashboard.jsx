import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import logo from '../Assets/user.png';
import { getTimeLeft } from '../utils/timeUtils.jsx';
import { fetchSurveysByEmail } from '../APIs/FetchSurveysByEmail.jsx';
import DashboardShimmer from './DashboardShimmer.jsx';

const Dashboard = () => {
    const [surveys, setSurveys] = useState([]);
    const [userEmail, setUserEmail] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const currentTime = new Date();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/"); // Redirect to login if token is missing
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub || decodedToken.email; // Adjust based on your token claims
            setUserEmail(email);

            // Start loading
            setIsLoading(true);
            
            fetchSurveysByEmail(email)
                .then(data => {
                    setSurveys(data);
                    setIsLoading(false); // Stop loading after data is fetched
                })
                .catch(error => {
                    console.error("Error fetching surveys:", error);
                    setIsLoading(false); // Stop loading even on error
                });
        } catch (err) {
            console.error("Invalid token", err);
            localStorage.removeItem("token");
            navigate("/");
        }
    }, [navigate]);

    // Show shimmer loading while data is being fetched
    if (isLoading) {
        return <DashboardShimmer />;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    const handleNavigate = (survey) => {
        const { id, title, attempted, result_show, endTime } = survey;
        const surveyEnded = new Date(endTime) <= currentTime;
        
        // Logic for navigation:
        // 1. If survey is ended, check if results should be shown
        if (surveyEnded) {
            if (result_show) {
                navigate(`/surveyresult/${id}`, { state: { title } });
            } else {
                // Survey ended but results not available to show
                
            }
            return;
        }
        
        // 2. For ongoing surveys:
        // - If attempted, check if results can be shown
        if (attempted) {
            if (result_show) {
                navigate(`/surveyresult/${id}`, { state: { title } });
            } else {
                
            }
        } else {
            // Not attempted yet, navigate to question page
            navigate('/questionpage', { state: { surveyId: id, title } });
        }
    };

    const ongoingSurveys = surveys.filter(survey => new Date(survey.endTime) > currentTime);
    const previousSurveys = surveys.filter(survey => new Date(survey.endTime) <= currentTime);

    const sortedOngoingSurveys = [...ongoingSurveys].sort((a, b) => {
        if (a.attempted !== b.attempted) {
            return a.attempted ? 1 : -1;
        }
        return new Date(a.endTime) - new Date(b.endTime);
    });

    const getRandomGradient = (attempted) => {
        const gradients = attempted ? [
            'from-emerald-400 to-teal-500',
            'from-green-400 to-cyan-500',
            'from-teal-400 to-blue-500',
            'from-cyan-400 to-sky-500'
        ] : [
            'from-amber-400 to-orange-500',
            'from-rose-400 to-red-500',
            'from-pink-400 to-rose-500',
            'from-fuchsia-400 to-purple-500'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-indigo-50 to-sky-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-violet-700 via-indigo-700 to-purple-800 shadow-xl">
                <div className="flex flex-col items-center py-8 px-4 space-y-6 h-full">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-75 blur-md group-hover:opacity-100 transition duration-300"></div>
                        <div className="relative">
                            <img 
                                src={logo} 
                                alt="User logo" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-white"
                            />
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                            <p className="text-white font-medium break-all">{userEmail}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="mt-auto w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
                    >
                        <span className="absolute top-0 left-0 w-full h-full bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                        <span className="relative">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {/* Header with animation */}
                <div className="mb-10 relative">
                    <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <div className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full opacity-20 blur-xl animate-pulse"></div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-700 to-indigo-800 relative">
                        Dashboard
                    </h1>
                    <div className="h-1 w-32 bg-gradient-to-r from-violet-500 to-fuchsia-500 mt-2"></div>
                </div>
                
                {/* Ongoing Surveys Section */}
                <section className="mb-12 relative">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-full opacity-20 blur-xl"></div>
                    
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700 mb-6 flex items-center">
                        <span className="mr-3 bg-gradient-to-br from-indigo-100 to-purple-100 p-2 rounded-lg text-indigo-700">📊</span>
                        Live Polls & Surveys
                    </h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedOngoingSurveys.length > 0 ? (
                            sortedOngoingSurveys.map(survey => {
                                const cardGradient = getRandomGradient(survey.attempted);
                                return (
                                <div 
                                    key={survey.id}
                                    onClick={() => handleNavigate(survey)}
                                    className="relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                                >
                                    {/* Background glow effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r from-pink-400 via-fuchsia-500 to-purple-600"></div>
                                    
                                    {/* Priority tag for unattempted surveys */}
                                    {!survey.attempted && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="animate-pulse bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold py-1 px-3 rounded-full shadow-md flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                                </svg>
                                                Pending
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Card top gradient line */}
                                    <div className={`h-2 w-full bg-gradient-to-r ${cardGradient}`}></div>
                                    
                                    <div className="p-6">
                                        <h2 className="text-xl font-bold text-indigo-900 mb-3 line-clamp-2 group-hover:text-purple-700 transition-colors duration-300">{survey.title}</h2>
                                        
                                        <div className="flex items-center text-purple-700 mb-2">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="bg-purple-50 px-2 py-0.5 rounded">{getTimeLeft(survey.endTime)}</span>
                                        </div>
                                        
                                        <div className="flex items-center text-indigo-600 mb-4">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                            <span className="bg-indigo-50 px-2 py-0.5 rounded">ID: {survey.id}</span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium group-hover:shadow-md transition-all duration-300 ${
                                                survey.attempted 
                                                    ? 'bg-gradient-to-r from-green-50 to-teal-50 text-teal-700 border border-green-200 group-hover:from-green-100 group-hover:to-teal-100' 
                                                    : 'bg-gradient-to-r from-amber-50 to-orange-50 text-orange-700 border border-amber-200 group-hover:from-amber-100 group-hover:to-orange-100'
                                            }`}>
                                                {survey.attempted 
                                                    ? (
                                                        <>
                                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                            Completed
                                                        </>
                                                    ) 
                                                    : (
                                                        <>
                                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Take Survey
                                                        </>
                                                    )
                                                }
                                            </div>
                                            
                                            <span className={`flex items-center bg-gradient-to-r ${
                                              survey.result_show
                                                ? 'from-purple-100 to-pink-100 text-purple-700 border-purple-200 group-hover:border-purple-300'
                                                : 'from-gray-100 to-gray-200 text-gray-700 border-gray-300 group-hover:border-gray-400'
                                            } text-sm py-1 px-3 rounded-full border transition-colors duration-200`}>
                                              {survey.result_show ? 'Can view Result' : 'Cannot view Result'}
                                              <svg
                                                className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                                                  survey.result_show ? 'text-purple-400 group-hover:translate-x-1' : 'text-gray-400'
                                                }`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M9 5l7 7-7 7"
                                                />
                                              </svg>
                                            </span>
                                        </div>
                                    </div>
                                        
                                    {/* Card bottom decoration */}
                                    <div className="relative h-1.5 bg-gray-100">
                                        <div className={`absolute top-0 left-0 h-full bg-gradient-to-r ${cardGradient}`} 
                                            style={{ width: survey.attempted ? '100%' : '0%', 
                                                   transition: 'width 0.5s ease-in-out' }}></div>
                                    </div>
                                </div>
                            )})
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow">
                                <div className="p-4 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50">
                                    <svg className="w-16 h-16 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <p className="mt-4 text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 font-medium">No ongoing surveys available</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Status Guide */}
                <div className="mb-8 rounded-lg shadow overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2">
                        <h3 className="text-white font-medium">Survey Status Guide</h3>
                    </div>
                    <div className="bg-white p-4">
                        <div className="flex flex-wrap gap-6 items-center">
                            <div className="flex items-center bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1.5 rounded-full shadow-sm border border-amber-100">
                                <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 mr-2"></span>
                                <span className="text-orange-700 font-medium">Pending Response</span>
                            </div>
                            
                            <div className="flex items-center bg-gradient-to-r from-green-50 to-teal-50 px-3 py-1.5 rounded-full shadow-sm border border-green-100">
                                <span className="inline-block w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-teal-500 mr-2"></span>
                                <span className="text-teal-700 font-medium">Completed</span>
                            </div>
                            
                            <div className="flex items-center ml-auto text-xs bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1.5 rounded-full shadow-sm border border-indigo-100">
                                <svg className="w-4 h-4 mr-1 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-indigo-600">Pending surveys shown first</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Previous Surveys Section */}
                <section className="relative">
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-pink-400 to-fuchsia-300 rounded-full opacity-20 blur-xl"></div>
                    
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-700 mb-6 flex items-center">
                        <span className="mr-3 bg-gradient-to-br from-purple-100 to-pink-100 p-2 rounded-lg text-purple-700">📜</span>
                        Previous Surveys
                    </h2>
                    
                    {previousSurveys.length > 0 ? (
                        <div className="bg-white rounded-xl shadow overflow-hidden relative">
                            {/* Decorative corner */}
                            <div className="absolute top-0 right-0 w-20 h-20">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-indigo-200 via-purple-100 to-transparent rounded-bl-full opacity-50"></div>
                            </div>
                            
                            <ul className="divide-y divide-indigo-100">
                                {previousSurveys.map(survey => {
                                    const gradient = getRandomGradient(survey.attempted);
                                    return (
                                    <li 
                                        key={survey.id}
                                        onClick={() => handleNavigate(survey)}
                                        className={`flex items-center justify-between p-5 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-colors duration-200 cursor-pointer relative group ${!survey.result_show ? 'opacity-70' : ''}`}
                                    >
                                        {/* Hover indicator */}
                                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-bottom"></div>
                                        
                                        <div className="flex items-center space-x-4">
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 bg-gradient-to-br ${
                                                survey.attempted 
                                                    ? 'from-green-100 to-teal-100 text-teal-700 group-hover:from-green-200 group-hover:to-teal-200' 
                                                    : 'from-amber-100 to-orange-100 text-orange-700 group-hover:from-amber-200 group-hover:to-orange-200'
                                            }`}>
                                                {survey.attempted ? (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-indigo-900 group-hover:text-purple-700 transition-colors duration-200">{survey.title}</h3>
                                                <p className="text-sm text-indigo-600">ID: {survey.id}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`bg-gradient-to-r ${survey.result_show ? 'from-purple-100 to-pink-100 text-purple-700' : 'from-gray-100 to-gray-200 text-gray-700'} text-sm py-1 px-3 rounded-full border border-purple-200 group-hover:border-purple-300 transition-colors duration-200`}>
                                                {survey.result_show ? 'Can view Result' : 'Cannot view Result'}
                                            </span>
                                            <svg className="w-5 h-5 text-indigo-400 ml-2 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </li>
                                )})}
                            </ul>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow">
                            <div className="p-4 rounded-full bg-gradient-to-r from-purple-100 to-pink-100">
                                <svg className="w-16 h-16 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <p className="mt-4 text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 font-medium">No previous surveys available</p>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default Dashboard;