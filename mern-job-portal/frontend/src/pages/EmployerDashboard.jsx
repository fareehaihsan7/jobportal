import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { resolveFileUrl } from "../api/axios.js";

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
    <div className="max-w-[900px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Employer dashboard</h2>
        <Link to="/post-job" className="bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 hover:no-underline">
          + Post a job
        </Link>
      </div>

      {loading && <p className="text-gray-500 text-sm">Loading your listings…</p>}
      {!loading && jobs.length === 0 && (
        <p className="text-gray-500 text-sm">You haven't posted any listings yet. <Link to="/post-job">Post your first one</Link>.</p>
      )}

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {jobs.map((job) => (
          <div key={job._id}>
            <div className="border-b border-gray-200 last:border-b-0 p-4 flex justify-between gap-4 items-start flex-wrap">
              <div>
                <span className="text-base font-bold text-blue-700">{job.title}</span>
                <p className="text-sm text-gray-500 mt-0.5 mb-1">
                  {job.location}{job.remote ? " · Remote" : ""} —{" "}
                  <span className={job.status === "open" ? "text-green-700 font-semibold" : "text-red-600 font-semibold"}>
                    {job.status}
                  </span>
                </p>
                <div className="flex gap-3 text-xs text-gray-500">
                  <span>{job.type}</span>
                  <span>{job.category}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap flex-shrink-0">
                <button
                  onClick={() => toggleApplicants(job._id)}
                  className="border border-gray-200 rounded-md px-3.5 py-1.5 text-xs font-medium text-gray-900 hover:border-blue-700 hover:text-blue-700"
                >
                  {expandedJob === job._id ? "Hide applicants" : "View applicants"}
                </button>
                <button
                  onClick={() => handleToggleStatus(job)}
                  className="border border-gray-200 rounded-md px-3.5 py-1.5 text-xs font-medium text-gray-900 hover:border-blue-700 hover:text-blue-700"
                >
                  {job.status === "open" ? "Close listing" : "Reopen listing"}
                </button>
                <Link
                  to={`/edit-job/${job._id}`}
                  className="border border-gray-200 rounded-md px-3.5 py-1.5 text-xs font-medium text-gray-900 hover:border-blue-700 hover:text-blue-700 hover:no-underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="border border-red-300 rounded-md px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedJob === job._id && (
              <div className="bg-gray-50 border-b border-gray-200 px-4 pb-4 pt-1">
                {applicantsLoading && <p className="text-gray-500 text-sm">Loading applicants…</p>}
                {!applicantsLoading && applicants.length === 0 && (
                  <p className="text-gray-500 text-sm">No applicants yet for this listing.</p>
                )}
                {!applicantsLoading && applicants.map((app) => (
                  <div key={app._id} className="flex justify-between gap-4 items-start border-b border-gray-200 last:border-b-0 py-3.5">
                    <div>
                      <p className="text-sm font-bold text-gray-900 m-0">{app.applicant.name}</p>
                      <p className="text-sm text-gray-500 my-0.5">
                        {app.applicant.email}{app.applicant.headline ? ` — ${app.applicant.headline}` : ""}
                      </p>
                      {app.coverLetter && <p className="text-sm text-gray-900 my-1.5 max-w-md">{app.coverLetter}</p>}
                      {app.resumeUrl && (
                        <a
                          href={resolveFileUrl(app.resumeUrl)}
                          target="_blank"
                          rel="noreferrer"
                          download
                          className="text-sm text-blue-700 hover:underline"
                        >
                          {app.resumeOriginalName ? `Download resume: ${app.resumeOriginalName} →` : "Download resume →"}
                        </a>
                      )}
                    </div>
                    <select
                      value={app.status}
                      onChange={(e) => updateStatus(app._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-md px-2 py-1.5 flex-shrink-0"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
