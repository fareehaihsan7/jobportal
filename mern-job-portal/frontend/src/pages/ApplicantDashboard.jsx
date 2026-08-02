import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

const STATUS_LABEL = {
  submitted: "Submitted",
  under_review: "Under review",
  interview: "Interview",
  rejected: "Not selected",
  hired: "Hired",
};

const statusPillClass = (status) => {
  const map = {
    submitted: "bg-gray-100 text-gray-600",
    under_review: "bg-yellow-50 text-yellow-800",
    interview: "bg-blue-50 text-blue-800",
    rejected: "bg-red-50 text-red-600",
    hired: "bg-green-50 text-green-700",
  };
  return `text-xs font-bold px-2.5 py-1 rounded-full h-fit whitespace-nowrap ${map[status] || "bg-gray-100 text-gray-600"}`;
};

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/applications/mine").then((res) => setApplications(res.data.applications)).finally(() => setLoading(false));
  }, []);
  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-10 px-6">
    <div className="max-w-5xl mx-auto">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-900">
            My Applications
          </h2>

          <p className="text-gray-500 mt-2">
            Track the progress of your applications.
          </p>
        </div>

        <div className="bg-white border border-blue-100 shadow-md rounded-2xl px-6 py-4">
          <p className="text-sm text-gray-500">
            Applications Submitted
          </p>

          <p className="text-3xl font-bold text-blue-600">
            {applications.length}
          </p>
        </div>
      </div>

      {/* Loading */}

      {loading && (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
          Loading applications...
        </div>
      )}

      {/* Empty state */}

      {!loading && applications.length === 0 && (
        <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📄</div>

          <h3 className="text-2xl font-bold text-gray-800">
            No applications yet
          </h3>

          <p className="text-gray-500 mt-3 mb-6">
            Start applying for jobs to track them here.
          </p>

          <Link
            to="/jobs"
            className="inline-flex bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>
        </div>
      )}

      {/* Applications */}

      <div className="space-y-5">
        {applications.map((app) => (
          <div
            key={app._id}
            className="bg-white border border-blue-100 rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-1">
                {app.job ? (
                  <Link
                    to={`/jobs/${app.job._id}`}
                    className="text-2xl font-bold text-blue-700 hover:text-blue-800"
                  >
                    {app.job.title}
                  </Link>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    Listing removed
                  </span>
                )}

                <div className="mt-4 flex flex-wrap gap-5 text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    <span>{app.job?.companyName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <span>{app.job?.location}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <span>
                      Applied{" "}
                      {new Date(
                        app.createdAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Application progress</span>

                    <span>
                      {app.status === "submitted"
                        ? "25%"
                        : app.status === "under_review"
                        ? "50%"
                        : app.status === "interview"
                        ? "75%"
                        : "100%"}
                    </span>
                  </div>

                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        app.status === "rejected"
                          ? "bg-red-500"
                          : app.status === "hired"
                          ? "bg-green-500"
                          : "bg-blue-600"
                      }`}
                      style={{
                        width:
                          app.status === "submitted"
                            ? "25%"
                            : app.status === "under_review"
                            ? "50%"
                            : app.status === "interview"
                            ? "75%"
                            : "100%",
                      }}
                    />
                  </div>
                </div>
              </div>

              <span className={statusPillClass(app.status)}>
                {STATUS_LABEL[app.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

};