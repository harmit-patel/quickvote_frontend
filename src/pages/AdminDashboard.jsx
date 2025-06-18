import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchSurveysByAdmin, deleteSurvey } from "../APIs/fetchSurveys";
import logo from '../Assets/user.png';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    let decoded = {};
    try {
        decoded = jwtDecode(token);
    } catch (e) {
        console.error("Invalid token");
        navigate("/login");
        return;
    }

    const [admin, setAdmin] = useState({
        email: decoded.sub || "Admin",
        role: decoded.role || ""
    });

    const [createdSurveys, setCreatedSurveys] = useState([]);

    useEffect(() => {
        if (decoded.sub) {
            fetchSurveysByAdmin(decoded.sub, token, setAdmin, setCreatedSurveys);
        }
    }, [token, decoded.sub]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navigateToSurvey = () => navigate("/CreateSurvey", { state: { adminEmail: decoded.sub } });

    const navigateToPoll = () => {
        navigate("/CreatePoll", { state: { adminEmail: decoded.sub } });
    };

    const handleEditSurvey = (surveyId) => navigate("/editsurvey", { state: { surveyId, adminEmail: decoded.sub } });

    const handleViewResult = (surveyId) => navigate("/adminresult", { state: { surveyId } });

    const handleDeleteSurvey = async (surveyId) => {
        const success = await deleteSurvey(surveyId, token);
        if (success) {
            setCreatedSurveys(prev => prev.filter(survey => survey.id !== surveyId));
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getRandomGradient = (index) => {
        const gradients = [
            "from-pink-400 to-purple-500",
            "from-cyan-400 to-blue-500",
            "from-green-400 to-emerald-500",
            "from-amber-400 to-orange-500",
            "from-fuchsia-400 to-pink-500",
            "from-rose-400 to-red-500",
            "from-indigo-400 to-blue-500",
            "from-violet-400 to-indigo-500",
            "from-teal-400 to-cyan-500",
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-violet-700 to-indigo-800 shadow-xl">
                <div className="flex flex-col items-center py-8 px-4 space-y-6 h-full">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                        <div className="relative">
                            <img
                                src={logo}
                                alt="Admin logo"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white"
                            />
                        </div>
                    </div>
                    <div className="text-center mt-4">
                        <p className="text-white font-medium break-all">{admin.email}</p>
                        <div className="mt-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
                            <p className="text-indigo-100 text-sm font-medium">Role: {admin.role || "Administrator"}</p>
                        </div>
                    </div>
                    <div className="w-full mt-6">
                        <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                            <h3 className="text-white text-sm font-medium mb-2">Quick Stats</h3>
                            <div className="flex justify-between">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-pink-300">{createdSurveys.length}</div>
                                    <div className="text-xs text-indigo-200">Surveys</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-cyan-300">0</div>
                                    <div className="text-xs text-indigo-200">Responses</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-emerald-300">0</div>
                                    <div className="text-xs text-indigo-200">Active</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-auto w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-2xl shadow-lg mb-8">
                        <div className="bg-white rounded-xl p-6">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="text-gray-600 mt-2">Manage your surveys and polls from one place</p>
                        </div>
                    </div>

                    {/* Create Options Section */}
                    <section className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Create Poll Card */}
                            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1">
                                <div className="h-3 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-200 mr-4 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-orange-600 group-hover:text-orange-500 transition-colors duration-300">Create Poll</h2>
                                    </div>
                                    <p className="text-orange-700 mb-6">Create a quick poll with multiple choice options for fast feedback.</p>
                                    <button 
                                        onClick={navigateToPoll} 
                                        className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group-hover:from-amber-400 group-hover:to-orange-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create New Poll
                                    </button>
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-orange-500 font-medium">Quick setup</div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-red-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Create Survey Card */}
                            <div className="group bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:rotate-1">
                                <div className="h-3 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"></div>
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="p-3 rounded-full bg-gradient-to-br from-cyan-100 to-blue-200 mr-4 group-hover:scale-110 transition-transform duration-300">
                                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-blue-600 group-hover:text-blue-500 transition-colors duration-300">Create Survey</h2>
                                    </div>
                                    <p className="text-blue-700 mb-6">Create a comprehensive survey with various question types for detailed insights.</p>
                                    <button 
                                        onClick={navigateToSurvey} 
                                        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group-hover:from-cyan-400 group-hover:to-blue-500"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create New Survey
                                    </button>
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-blue-500 font-medium">Advanced features</div>
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Previously Created Surveys Section */}
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                                <span className="mr-3">📊</span>
                                Previously Created Surveys
                            </h2>
                            <div className="flex space-x-2">
                                <div className="px-3 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full text-xs font-medium text-indigo-700">
                                    Total: {createdSurveys.length}
                                </div>
                            </div>
                        </div>
                        
                        {createdSurveys.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {createdSurveys.map((survey, index) => (
                                    <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-102">
                                        <div className={`h-3 w-full bg-gradient-to-r ${getRandomGradient(index)}`}></div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-3">
                                                <h3 className="text-xl font-bold text-indigo-900 line-clamp-2 mr-2">{survey.name}</h3>
                                                <div className="flex-shrink-0">
                                                    <div className="px-2 py-1 bg-indigo-100 rounded-full text-xs font-medium text-indigo-600">
                                                        ID: {survey.id}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center text-purple-700 mb-4">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{formatDate(survey.createdDate)}</span>
                                                <div className="ml-auto">
                                                    <div className="inline-flex space-x-1">
                                                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                                                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                                        <span className="w-2 h-2 rounded-full bg-red-400"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-6 grid grid-cols-3 gap-2">
                                                <button 
                                                    onClick={() => handleEditSurvey(survey.id)}
                                                    className="relative overflow-hidden group flex items-center justify-center py-2 px-3 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 rounded-lg transition-all duration-300 hover:from-indigo-100 hover:to-blue-100"
                                                >
                                                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-100 to-blue-100 transition-all duration-300 group-hover:w-full"></span>
                                                    <svg className="relative w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span className="relative">Edit</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteSurvey(survey.id)}
                                                    className="relative overflow-hidden group flex items-center justify-center py-2 px-3 bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 rounded-lg transition-all duration-300 hover:from-rose-100 hover:to-red-100"
                                                >
                                                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-rose-100 to-red-100 transition-all duration-300 group-hover:w-full"></span>
                                                    <svg className="relative w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    <span className="relative">Delete</span>
                                                </button>
                                                <button 
                                                    onClick={() => handleViewResult(survey.id)}
                                                    className="relative overflow-hidden group flex items-center justify-center py-2 px-3 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 rounded-lg transition-all duration-300 hover:from-violet-100 hover:to-purple-100"
                                                >
                                                    <span className="absolute inset-0 w-0 bg-gradient-to-r from-violet-100 to-purple-100 transition-all duration-300 group-hover:w-full"></span>
                                                    <svg className="relative w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <span className="relative">Results</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                                <div className="p-6 mx-auto">
                                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                        <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-indigo-900 mb-2">No surveys created yet</h3>
                                    <p className="text-indigo-600 mb-6">Create your first survey or poll using the options above.</p>
                                    <div className="flex justify-center space-x-4">
                                        <button 
                                            onClick={navigateToPoll}
                                            className="py-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            Create Poll
                                        </button>
                                        <button 
                                            onClick={navigateToSurvey}
                                            className="py-2 px-4 bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                                        >
                                            Create Survey
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;