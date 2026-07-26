import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const inputClass = "px-3 py-2.5 border border-gray-200 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-gray-900";

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [applyStatus, setApplyStatus] = useState(null);
  const [applyMessage, setApplyMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch(() => setError("This listing could not be found."))
      .finally(() => setLoading(false));
  }, [id]);

  const ALLOWED_EXT = [".pdf", ".doc", ".docx"];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError("");
    setResumeFile(null);
    if (!file) return;
    const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setFileError("Please upload a PDF, DOC, or DOCX file.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File is too large — 5MB maximum.");
      e.target.value = "";
      return;
    }
    setResumeFile(file);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApplyStatus(null);
    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (resumeFile) formData.append("resume", resumeFile);
      await api.post(`/applications/job/${id}`, formData);
      setApplyStatus("success");
      setApplyMessage("Your application has been submitted.");
    } catch (err) {
      setApplyStatus("error");
      setApplyMessage(err.response?.data?.message || "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="max-w-[1100px] mx-auto px-6 py-8"><p className="text-gray-500 text-sm">Loading…</p></div>;
  if (error) return <div className="max-w-[1100px] mx-auto px-6 py-8"><p className="text-red-600 text-sm">{error}</p></div>;
  if (!job) return null;

  return (
    <div className="max-w-[1000px] mx-auto px-6 pt-6 pb-16">
      <Link to="/jobs" className="text-sm text-blue-700 hover:underline">← Back to search results</Link>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 mt-4 items-start">
        <div className="bg-white border border-gray-200 rounded-lg p-7">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h1>
          <p className="text-gray-500 font-medium mb-3">{job.companyName}</p>

          <div className="flex flex-wrap gap-3.5 items-center text-sm text-gray-500 mb-2">
            <span>{job.location}{job.remote ? " · Remote" : ""}</span>
            <span className="text-xs font-semibold bg-blue-50 text-blue-800 px-2.5 py-1 rounded-full">{job.type}</span>
            <span>{job.category}</span>
          </div>

          {(job.salaryMin || job.salaryMax) && (
            <p className="font-bold text-green-700 text-base mb-5">
              {job.currency} {job.salaryMin?.toLocaleString()}{job.salaryMax ? ` – ${job.salaryMax.toLocaleString()}` : ""}
            </p>
          )}

          <section>
            <h3 className="text-base font-bold text-gray-900 mt-2 mb-2">Full job description</h3>
            <p className="text-sm text-gray-900 leading-relaxed">{job.description}</p>
          </section>

          {job.requirements?.length > 0 && (
            <section>
              <h3 className="text-base font-bold text-gray-900 mt-6 mb-2">Requirements</h3>
              <ul className="list-disc pl-5 text-sm leading-loose text-gray-900">
                {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </section>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 md:sticky md:top-20">
          <h3 className="text-base font-bold text-gray-900 mt-0 mb-3">Apply for this job</h3>

          {!user && (
            <p className="text-sm text-gray-500">
              <Link to="/login">Sign in</Link> or <Link to="/register">create an account</Link> to apply.
            </p>
          )}

          {user && user.role === "employer" && (
            <p className="text-sm text-gray-500">Employer accounts can't apply to jobs.</p>
          )}

          {user && user.role === "applicant" && applyStatus !== "success" && (
            <form onSubmit={handleApply} className="flex flex-col gap-4">
              <label className={labelClass}>
                Resume (PDF, DOC, or DOCX — 5MB max)
                <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="text-sm" />
              </label>
              {fileError && <p className="text-red-600 text-sm">{fileError}</p>}
              {resumeFile && <p className="text-gray-500 text-sm">Attached: {resumeFile.name}</p>}
              {!resumeFile && user.resumeUrl && (
                <p className="text-gray-500 text-sm">
                  Using your saved resume{user.resumeOriginalName ? ` (${user.resumeOriginalName})` : ""}.
                </p>
              )}
              {!resumeFile && !user.resumeUrl && (
                <p className="text-gray-500 text-sm">
                  No resume on file. Attach one above, or <Link to="/profile">add one to your profile</Link>.
                </p>
              )}
              <label className={labelClass}>
                Cover letter (optional)
                <textarea
                  rows={5}
                  placeholder="A few lines on why you're a fit…"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className={inputClass}
                />
              </label>
              {applyStatus === "error" && <p className="text-red-600 text-sm">{applyMessage}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </form>
          )}

          {applyStatus === "success" && <p className="text-green-700 font-semibold text-sm">{applyMessage}</p>}
        </div>
      </div>
    </div>
  );
}