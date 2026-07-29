import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { resolveFileUrl } from "../api/axios.js";
import {
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiLock,
  FiMapPin,
  FiBriefcase,
  FiPlus,
} from "react-icons/fi";

const STATUS_OPTIONS = ["submitted", "under_review", "interview", "rejected", "hired"];

const statusPillClass = (status) => {
  const map = {
    submitted: "bg-gray-100 text-gray-600",
    under_review: "bg-yellow-50 text-yellow-800",
    interview: "bg-blue-50 text-blue-800",
    rejected: "bg-red-50 text-red-600",
    hired: "bg-green-50 text-green-700",
  };
  return `text-xs font-bold capitalize px-2.5 py-1 rounded-full ${map[status] || "bg-gray-100 text-gray-600"}`;
};

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const fetchJobs = () => {
    setLoading(true);
    api.get("/jobs/mine").then((res) => setJobs(res.data.jobs)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchJobs(); }, []);

  const toggleApplicants = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    setApplicantsLoading(true);
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      setApplicants(res.data.applications);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    await api.delete(`/jobs/${jobId}`);
    fetchJobs();
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === "open" ? "closed" : "open";
    await api.put(`/jobs/${job._id}`, { status: newStatus });
    setJobs((prev) => prev.map((j) => (j._id === job._id ? { ...j, status: newStatus } : j)));
  };

  const updateStatus = async (appId, status) => {
    await api.put(`/applications/${appId}/status`, { status });
    setApplicants((prev) => prev.map((a) => (a._id === appId ? { ...a, status } : a)));
  };

  return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-6xl mx-auto px-4">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-8 text-white shadow-lg mb-8">
       <div className="flex flex-col md:flex-row justify-between items-center gap-5">

  <div>
    <h1 className="text-3xl font-bold">
      Employer Dashboard
    </h1>

    <p className="text-blue-100 mt-2">
      Manage your job postings and applicants.
    </p>
  </div>

  <div className="flex gap-3">

    <Link
      to="/employer/profile"
      className="flex items-center gap-2 bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold shadow hover:bg-gray-100 hover:no-underline transition"
    >
      👤 Employer Profile
    </Link>

    <Link
      to="/post-job"
      className="flex items-center gap-2 bg-indigo-900 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-indigo-950 hover:no-underline transition"
    >
      <FiPlus />
      Post Job
    </Link>

  </div>

</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Total Jobs</p>
          <h2 className="text-3xl font-bold">{jobs.length}</h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Open Jobs</p>
          <h2 className="text-3xl font-bold text-green-600">
            {jobs.filter((j) => j.status === "open").length}
          </h2>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-gray-500 text-sm">Closed Jobs</p>
          <h2 className="text-3xl font-bold text-red-500">
            {jobs.filter((j) => j.status !== "open").length}
          </h2>
        </div>
      </div>

      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading your listings...
        </div>
      )}

      {!loading && jobs.length === 0 && (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h3 className="text-xl font-semibold mb-3">
            No jobs posted yet
          </h3>

          <Link
            to="/post-job"
            className="bg-blue-700 text-white px-5 py-3 rounded-lg hover:bg-blue-800 hover:no-underline"
          >
            Post Your First Job
          </Link>
        </div>
      )}

      <div className="space-y-6">

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6"
          >

            <div className="flex flex-col lg:flex-row justify-between gap-6">

              {/* Job Details */}
              <div className="flex-1">

                <h2 className="text-2xl font-bold text-blue-700">
                  {job.title}
                </h2>

                <div className="flex flex-wrap gap-5 text-gray-600 mt-3">

                  <div className="flex items-center gap-2">
                    <FiMapPin />
                    {job.location}
                    {job.remote && " • Remote"}
                  </div>

                  <div className="flex items-center gap-2">
                    <FiBriefcase />
                    {job.type}
                  </div>

                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {job.category}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      job.status === "open"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {job.status}
                  </span>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 h-fit">

                <button
                  onClick={() => toggleApplicants(job._id)}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                >
                  <FiUsers size={16} />
                  {expandedJob === job._id ? "Hide" : "Applicants"}
                </button>

                <button
                  onClick={() => handleToggleStatus(job)}
                  className="flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
                >
                  <FiLock size={16} />
                  {job.status === "open" ? "Close" : "Reopen"}
                </button>

                <Link
                  to={`/edit-job/${job._id}`}
                  className="flex items-center gap-2 bg-slate-700 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition hover:no-underline"
                >
                  <FiEdit2 size={15} />
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                  <FiTrash2 size={15} />
                  Delete
                </button>

              </div>

            </div>

            {/* Applicants */}
            {expandedJob === job._id && (
              <div className="mt-6 border-t pt-5">

                {applicantsLoading && (
                  <p className="text-gray-500">Loading applicants...</p>
                )}

                {!applicantsLoading && applicants.length === 0 && (
                  <p className="text-gray-500">
                    No applicants yet.
                  </p>
                )}

                {!applicantsLoading &&
                  applicants.map((app) => (
                    <div
                      key={app._id}
                      className="bg-gray-50 rounded-xl p-5 mb-4 flex flex-col md:flex-row justify-between gap-5"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">
                          {app.applicant.name}
                        </h3>

                        <p className="text-gray-600">
                          {app.applicant.email}
                        </p>

                        {app.applicant.headline && (
                          <p className="text-blue-700 mt-1">
                            {app.applicant.headline}
                          </p>
                        )}

                        {app.coverLetter && (
                          <p className="mt-3 text-gray-700">
                            {app.coverLetter}
                          </p>
                        )}

                        {app.resumeUrl && (
                          <a
                            href={resolveFileUrl(app.resumeUrl)}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="inline-block mt-3 text-blue-700 hover:underline"
                          >
                            📄 Download Resume
                          </a>
                        )}
                      </div>

                      <div>
                        <select
                          value={app.status}
                          onChange={(e) =>
                            updateStatus(app._id, e.target.value)
                          }
                          className="border rounded-lg px-3 py-2"
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  </div>
  
);
};
