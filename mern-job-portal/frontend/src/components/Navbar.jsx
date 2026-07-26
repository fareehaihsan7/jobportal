import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-[1100px] mx-auto px-6 py-3.5 flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="TalentHub" className="h-8" />
        </Link>

        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6 pr-6 border-r border-gray-200">
            <Link to="/jobs" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">Find jobs</Link>
            {user?.role === "applicant" && (
              <Link to="/saved-jobs" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">Saved jobs</Link>
            )}
            {user?.role === "applicant" && (
              <Link to="/profile" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">Profile</Link>
            )}
            {user?.role === "applicant" && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">My applications</Link>
            )}
            {user?.role === "employer" && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">Dashboard</Link>
            )}
            {user?.role === "employer" && (
              <Link to="/profile" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">Company profile</Link>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user?.role === "employer" && (
              <Link
                to="/post-job"
                className="border-[1.5px] border-blue-700 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-50 hover:no-underline"
              >
                Post a job
              </Link>
            )}
            {!user && (
              <Link to="/login" className="text-sm font-medium text-gray-900 hover:text-blue-700 hover:no-underline">
                Sign in
              </Link>
            )}
            {!user && (
              <Link
                to="/register"
                className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 hover:no-underline"
              >
                Register
              </Link>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-900 hover:text-blue-700 bg-transparent border-none cursor-pointer"
              >
                Log out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}