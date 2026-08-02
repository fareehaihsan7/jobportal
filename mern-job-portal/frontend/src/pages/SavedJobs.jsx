import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/jobs/saved/mine")
      .then((res) => {
        setJobs(res.data.jobs);
        setSavedIds(new Set(res.data.jobs.map((j) => j._id)));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleToggleSave = async (jobId) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.delete(jobId);
      return next;
    });
    setJobs((prev) => prev.filter((j) => j._id !== jobId));
    try {
      await api.post(`/jobs/${jobId}/save`);
    } catch {
      load();
    }
  };


return (
  <div className="min-h-screen bg-slate-50">

    {/* Hero */}
    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h1 className="text-4xl font-bold text-white">
          Saved Jobs
        </h1>

        <p className="text-blue-100 mt-2 max-w-2xl">
          Keep track of opportunities you're interested in and apply whenever
          you're ready.
        </p>

      </div>
    </div>

    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-gray-500 text-sm">Saved Jobs</p>
          <h2 className="text-3xl font-bold text-blue-700">
            {jobs.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-gray-500 text-sm">Remote Jobs</p>
          <h2 className="text-3xl font-bold text-green-600">
            {jobs.filter(j => j.remote).length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <p className="text-gray-500 text-sm">Full-time Jobs</p>
          <h2 className="text-3xl font-bold text-indigo-600">
            {jobs.filter(j => j.type === "Full-time").length}
          </h2>
        </div>

      </div>

      {/* Toolbar */}

      <div className="bg-white rounded-2xl border shadow-sm p-5 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">

        <input
          type="text"
          placeholder="Search saved jobs..."
          className="w-full md:w-96 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <div className="flex gap-3">

          <select className="px-4 py-3 border rounded-xl">
            <option>Newest Saved</option>
            <option>Highest Salary</option>
            <option>Newest Posted</option>
          </select>

          {jobs.length > 0 && (
            <button className="px-5 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition">
              Clear All
            </button>
          )}

        </div>

      </div>

      {loading && (
        <div className="bg-white rounded-2xl p-10 text-center shadow-sm border">
          <p className="text-gray-500">Loading your saved jobs...</p>
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="bg-white rounded-3xl shadow-sm border p-14 text-center">

          <div className="w-24 h-24 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-5xl">
            📑
          </div>

          <h2 className="text-2xl font-bold mt-6">
            No saved jobs yet
          </h2>

          <p className="text-gray-500 mt-3 mb-8">
            Save jobs you're interested in so you can easily find them later.
          </p>

          <Link
            to="/jobs"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition"
          >
            Browse Jobs
          </Link>

        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="space-y-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <JobCard
                job={job}
                showSave
                isSaved={savedIds.has(job._id)}
                onToggleSave={handleToggleSave}
              />
            </div>
          ))}
        </div>
      )}

    </div>
  </div>
);
};