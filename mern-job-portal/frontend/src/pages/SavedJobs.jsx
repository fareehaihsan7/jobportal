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
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Saved jobs</h1>
        <span className="text-sm text-gray-500">{jobs.length} saved</span>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}

      {!loading && jobs.length === 0 && (
        <p className="text-gray-500 text-sm">
          Nothing saved yet. <Link to="/jobs">Browse open jobs</Link> and tap the bookmark icon to save one.
        </p>
      )}

      {!loading && jobs.length > 0 && (
        <div className="flex flex-col gap-3">
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              showSave
              isSaved={savedIds.has(job._id)}
              onToggleSave={handleToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}