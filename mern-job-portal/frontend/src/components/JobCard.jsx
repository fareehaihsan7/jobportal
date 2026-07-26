import React from "react";
import { Link } from "react-router-dom";
import { resolveFileUrl } from "../api/axios.js";

function formatSalary(job) {
  if (!job.salaryMin && !job.salaryMax) return null;
  const cur = job.currency || "PKR";
  if (job.salaryMin && job.salaryMax) return `${cur} ${job.salaryMin.toLocaleString()} – ${job.salaryMax.toLocaleString()}`;
  return `${cur} ${(job.salaryMin || job.salaryMax).toLocaleString()}`;
}

function timeAgo(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function JobCard({ job, showSave, isSaved, onToggleSave }) {
  const salary = formatSalary(job);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleSave?.(job._id);
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="relative block bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md hover:border-gray-300 hover:no-underline transition"
    >
      {showSave && (
        <button
          type="button"
          onClick={handleSaveClick}
          aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          className="absolute top-4 right-4 text-gray-400 hover:text-blue-700"
        >
          {isSaved ? (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" className="text-blue-700">
              <path d="M4 2.5A1.5 1.5 0 015.5 1h9A1.5 1.5 0 0116 2.5V19l-6-3.5L4 19V2.5z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 2.5A1.5 1.5 0 015.5 1h9A1.5 1.5 0 0116 2.5V19l-6-3.5L4 19V2.5z" />
            </svg>
          )}
        </button>
      )}

      <div className="flex items-start gap-3">
        {job.companyLogoUrl ? (
          <img
            src={resolveFileUrl(job.companyLogoUrl)}
            alt={job.companyName}
            className="w-10 h-10 rounded object-cover border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded bg-blue-50 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">
            {job.companyName?.[0]?.toUpperCase() || "?"}
          </div>
        )}
        <div className="pr-6">
          <h3 className="text-base font-bold text-blue-700 m-0">{job.title}</h3>
          <p className="text-sm text-gray-900 font-medium mt-0.5">{job.companyName}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <p className="text-sm text-gray-500 m-0">{job.location}</p>
        {job.remote && (
          <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full whitespace-nowrap">
            Remote
          </span>
        )}
      </div>
      {salary && <p className="text-sm font-bold text-green-700 mt-1">{salary}</p>}

      <p className="text-sm text-gray-500 leading-relaxed mt-2 line-clamp-2">{job.description}</p>

      <div className="flex items-center gap-3 mt-3">
        <span className="text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full">{job.type}</span>
        <span className="text-xs text-gray-500">Posted {timeAgo(job.createdAt)}</span>
      </div>
    </Link>
  );
}
