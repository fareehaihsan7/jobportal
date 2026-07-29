import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostJob from "./pages/PostJob.jsx";
import EmployerDashboard from "./pages/EmployerDashboard.jsx";
import ApplicantDashboard from "./pages/ApplicantDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";
import Landing from "./pages/Landing.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import EmployerProfile from "./pages/EmployerProfile";
function Dashboard() {
  const { user } = useAuth();
  if (user?.role === "employer") return <EmployerDashboard />;
  return <ApplicantDashboard />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-jobs"
          element={
            <ProtectedRoute role="applicant">
              <SavedJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post-job"
          element={
            <ProtectedRoute role="employer">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-job/:id"
          element={
            <ProtectedRoute role="employer">
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
  path="/edit-profile"
  element={
    <ProtectedRoute>
      <EditProfile />
    </ProtectedRoute>
  }
/>
<Route
  path="/employer/profile"
  element={<EmployerProfile />}
/>
      </Routes>
      <footer className="text-center text-xs text-gray-500 py-8 border-t border-gray-200 mt-auto">
        © 2026 TalentHub · Built with the MERN stack
      </footer>
    </div>
  );
}