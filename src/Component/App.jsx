import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import LoginPage from '../pages/LoginPage';
import RegistrationForm from './RegistrationForm';
import Dashboard from '../pages/Dashboard';
import HomePage1 from '../pages/HomePage1.jsx';
import LoginParticipant from '../pages/LoginParticipant';
import QuestionPage from '../pages/QuestionPage';
import AdminDashboard from '../pages/AdminDashboard';
import SurveyResult from '../pages/SurveyResult';
import EditSurvey from '../pages/EditSurvey.jsx'
import CreateSurvey from '../pages/CreateSurvey.jsx';
import CreatePoll from '../pages/CreatePoll.jsx';
import SuperAdminDashboard from '../pages/SuperAdminDashboard.jsx';
import AdminResult from '../pages/AdminResultPage.jsx';
import Unauthorized from '../pages/Unauthorized.jsx';
import PrivateRoute from '../Component/PrivateRoute.jsx'; // Import wrapper

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage1 />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/loginparticipant" element={<LoginParticipant />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* USER Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/questionpage"
          element={
            <PrivateRoute allowedRoles={['USER']}>
              <QuestionPage />
            </PrivateRoute>
          }
        />
<Route
  path="/surveyresult/:id"
  element={
    <PrivateRoute allowedRoles={['USER']}>
      <SurveyResult />
    </PrivateRoute>
  }
/>


        {/* ADMIN Routes */}
        <Route
          path="/admindashboard"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/CreateSurvey"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <CreateSurvey />
            </PrivateRoute>
          }
        />
        <Route
          path="/CreatePoll"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <CreatePoll />
            </PrivateRoute>
          }
        />
        <Route
          path="/editsurvey"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <EditSurvey />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminresult"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <AdminResult />
            </PrivateRoute>
          }
        />

        {/* SUPER ADMIN Route */}
        <Route
          path="/superadmindashboard"
          element={
            <PrivateRoute allowedRoles={['superAdmin']}>
              <SuperAdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
