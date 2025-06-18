import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import superAdminImage from '../Assets/user.png';

// Import API functions
import { 
  getSuperAdminData, 
  fetchPendingAdmins,
  fetchApprovedAdmins,
  processAdminRequest,
  verifySuperAdmin
} from '../APIs/SuperAdminDashboardAPI';

const SuperAdminDashboard = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [adminData, setAdminData] = useState({ email: "", role: "" });
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is a super admin
    if (!verifySuperAdmin()) {
      navigate("/login");
      return;
    }

    // Get admin data from token
    const data = getSuperAdminData();
    if (data) {
      setAdminData(data);
    }

    // Fetch admin data
    loadAdminData();
  }, [navigate]);

  const loadAdminData = async () => {
    try {
      const pendingData = await fetchPendingAdmins();
      const approvedData = await fetchApprovedAdmins();
      
      setPendingAdmins(pendingData);
      setApprovedAdmins(approvedData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAction = async (email, status) => {
    try {
      await processAdminRequest(email, status);
      // Reload admin data after action
      loadAdminData();
    } catch (error) {
      console.error(`Error ${status} admin:`, error);
    }
  };

  // Function to get a random gradient for admin cards
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
      <aside className="w-64 bg-gradient-to-b from-violet-800 to-indigo-900 shadow-xl">
        <div className="flex flex-col items-center py-8 px-4 space-y-6 h-full">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300 animate-pulse"></div>
            <div className="relative">
              <img 
                src={superAdminImage} 
                alt="Super Admin" 
                className="w-32 h-32 rounded-full object-cover border-4 border-white"
              />
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-white font-medium break-all">{adminData.email}</p>
            <div className="mt-2 bg-white/20 rounded-full px-3 py-1 backdrop-blur-sm">
              <p className="text-indigo-100 text-sm font-medium">Role: {adminData.role}</p>
            </div>
          </div>
          <div className="w-full mt-6">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-white text-sm font-medium mb-2">Admin Stats</h3>
              <div className="flex justify-between">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-300">{pendingAdmins.length}</div>
                  <div className="text-xs text-indigo-200">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-300">{approvedAdmins.length}</div>
                  <div className="text-xs text-indigo-200">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-300">{pendingAdmins.length + approvedAdmins.length}</div>
                  <div className="text-xs text-indigo-200">Total</div>
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
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage admin requests and monitor platform usage</p>
            </div>
          </div>

          {/* Admin Management Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Admin Requests Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                  <span className="mr-3">🔔</span>
                  Pending Admin Requests
                </h2>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-xs font-medium text-orange-700">
                    Total: {pendingAdmins.length}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {pendingAdmins.length > 0 ? (
                  pendingAdmins.map((admin, index) => (
                    <div key={admin.email} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className={`h-2 w-full bg-gradient-to-r from-amber-400 to-orange-500`}></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-indigo-900 line-clamp-1">{admin.institutionName}</h3>
                          <div className="px-2 py-1 bg-amber-100 rounded-full text-xs font-medium text-amber-600">
                            Pending
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm truncate">{admin.email}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm">{admin.phoneNumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center mb-4">
                          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span className="text-sm text-gray-700">{admin.fixedDomain}</span>
                        </div>
                        
                        <div className="flex space-x-3 mt-4">
                          <button 
                            onClick={() => handleAction(admin.email, 'accepted')}
                            className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Accept
                          </button>
                          <button 
                            onClick={() => handleAction(admin.email, 'rejected')}
                            className="flex-1 py-2 px-3 bg-gradient-to-r from-rose-500 to-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="p-6 mx-auto">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-indigo-900 mb-2">No pending requests</h3>
                      <p className="text-indigo-600">All admin requests have been processed.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Approved Admins Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-indigo-900 flex items-center">
                  <span className="mr-3">✅</span>
                  Approved Admins
                </h2>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-xs font-medium text-emerald-700">
                    Total: {approvedAdmins.length}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {approvedAdmins.length > 0 ? (
                  approvedAdmins.map((admin, index) => (
                    <div key={admin.email} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className={`h-2 w-full bg-gradient-to-r ${getRandomGradient(index)}`}></div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-indigo-900 line-clamp-1">{admin.institutionName}</h3>
                          <div className="px-2 py-1 bg-emerald-100 rounded-full text-xs font-medium text-emerald-600">
                            Approved
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm truncate">{admin.email}</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <span className="text-sm">{admin.phoneNumber}</span>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                          <span className="text-sm text-gray-700">{admin.fixedDomain}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="p-6 mx-auto">
                      <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-semibold text-indigo-900 mb-2">No approved admins</h3>
                      <p className="text-indigo-600">Admins will appear here once approved.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* System Overview Section */}
          <section className="mt-12">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-violet-400 to-indigo-500"></div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-indigo-900 mb-6">System Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-indigo-600 text-sm font-medium">Total Institutions</p>
                        <p className="text-3xl font-bold text-indigo-900 mt-1">{approvedAdmins.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-pink-600 text-sm font-medium">Pending Requests</p>
                        <p className="text-3xl font-bold text-pink-900 mt-1">{pendingAdmins.length}</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-600 text-sm font-medium">System Status</p>
                        <p className="text-3xl font-bold text-emerald-900 mt-1">Online</p>
                      </div>
                      <div className="p-3 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;