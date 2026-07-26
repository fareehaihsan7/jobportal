import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = ["Engineering", "Design", "Marketing", "Sales", "Operations", "Other"].sort((a, b) =>
  a.localeCompare(b, undefined, { sensitivity: "base" })
);
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const chipClass = (active) =>
  `px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer transition border ${
    active
      ? "bg-white text-blue-700 border-white"
      : "bg-white/10 text-white border-white/40 hover:bg-white/20"
  }`;

export default function Jobs() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [type, setType] = useState("");
  const [remote, setRemote] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [categoryCounts, setCategoryCounts] = useState({});
  const [locationCounts, setLocationCounts] = useState({});
  const [savedIds, setSavedIds] = useState(new Set());
  const [categorySearch, setCategorySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, limit: 8 };
      if (q) params.q = q;
      if (location) params.location = location;
      if (category) params.category = category;
      if (type) params.type = type;
      if (remote) params.remote = true;

      const res = await api.get("/jobs", { params });
      setJobs(res.data.jobs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setError("Could not load listings. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/jobs/categories/counts").then((res) => setCategoryCounts(res.data.counts)).catch(() => {});
    api.get("/jobs/locations/counts").then((res) => setLocationCounts(res.data.counts)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.role !== "applicant") return;
    api
      .get("/jobs/saved/mine")
      .then((res) => setSavedIds(new Set(res.data.jobs.map((j) => j._id))))
      .catch(() => {});
  }, [user]);

  const handleToggleSave = async (jobId) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(jobId) ? next.delete(jobId) : next.add(jobId);
      return next;
    });
    try {
      await api.post(`/jobs/${jobId}/save`);
    } catch {
      // revert on failure
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.has(jobId) ? next.delete(jobId) : next.add(jobId);
        return next;
      });
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, category, location, type, remote, searchTrigger]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTrigger((n) => n + 1);
  };

  const selectCategory = (c) => {
    setCategory((current) => (current === c ? "" : c));
    setPage(1);
  };

  const selectLocation = (loc) => {
    setLocation((current) => (current === loc ? "" : loc));
    setPage(1);
  };

  const toggleChip = (value, current, setter) => {
    setter(current === value ? "" : value);
    setPage(1);
  };

  const totalOpenJobs = Object.values(categoryCounts).reduce((sum, n) => sum + n, 0);

  const sortedLocationEntries = Object.entries(locationCounts).sort(([a], [b]) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );

  const filteredCategories = CATEGORIES.filter((c) =>
    c.toLowerCase().includes(categorySearch.trim().toLowerCase())
  );
  const filteredLocationEntries = sortedLocationEntries.filter(([loc]) =>
    loc.toLowerCase().includes(citySearch.trim().toLowerCase())
  );

  return (
    <div>
      <div className="bg-blue-700 px-6 pt-8 pb-5">
        <form onSubmit={handleSearch} className="max-w-[780px] mx-auto bg-white rounded flex items-center shadow-lg overflow-hidden">
          <div className="flex-1 flex items-center gap-2 px-4 py-3">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <path d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.42-1.42l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z" fill="#6b7280" />
            </svg>
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="border-none outline-none text-sm w-full text-gray-900"
            />
          </div>
          <div className="w-px self-stretch bg-gray-200 my-2" />
          <div className="flex-1 flex items-center gap-2 px-4 py-3">
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
              <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zm0 8.5A2.5 2.5 0 1110 5a2.5 2.5 0 010 5.5z" fill="#6b7280" />
            </svg>
            <input
              type="text"
              placeholder="City or 'Remote'"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border-none outline-none text-sm w-full text-gray-900"
            />
          </div>
          <button type="submit" className="bg-blue-700 text-white px-6 py-3 text-sm font-semibold hover:bg-blue-800">
            Find jobs
          </button>
        </form>

        <div className="max-w-[780px] mx-auto mt-4 flex flex-wrap gap-2 items-center">
          {TYPES.map((t) => (
            <button key={t} type="button" className={chipClass(type === t)} onClick={() => toggleChip(t, type, setType)}>
              {t}
            </button>
          ))}
          <button type="button" className={chipClass(remote)} onClick={() => setRemote((v) => !v)}>
            Remote
          </button>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-6 pt-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-7 items-start">
          <aside className="bg-white border border-gray-200 rounded-lg p-4 md:sticky md:top-20">
            <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900 mb-2">Categories</h3>
            <input
              type="text"
              placeholder="Search categories A-Z"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded px-2.5 py-1.5 mb-2 outline-none focus:border-blue-400 text-gray-900"
            />
            <div className="flex flex-col gap-0.5">
              {categorySearch === "" && (
                <button
                  type="button"
                  onClick={() => selectCategory("")}
                  className={`flex justify-between items-center gap-2 px-2.5 py-2 rounded text-sm text-left ${
                    category === "" ? "bg-blue-50 text-blue-800 font-semibold" : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>All categories</span>
                  <span className={category === "" ? "text-blue-800 text-xs" : "text-gray-500 text-xs"}>{totalOpenJobs}</span>
                </button>
              )}
              {filteredCategories.length === 0 && (
                <p className="text-xs text-gray-500 px-2.5 py-2">No categories match.</p>
              )}
              {filteredCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => selectCategory(c)}
                  className={`flex justify-between items-center gap-2 px-2.5 py-2 rounded text-sm text-left ${
                    category === c ? "bg-blue-50 text-blue-800 font-semibold" : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <span>{c}</span>
                  <span className={category === c ? "text-blue-800 text-xs" : "text-gray-500 text-xs"}>{categoryCounts[c] || 0}</span>
                </button>
              ))}
            </div>

            {sortedLocationEntries.length > 0 && (
              <>
                <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900 mt-5 mb-2">Cities</h3>
                <input
                  type="text"
                  placeholder="Search cities A-Z"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded px-2.5 py-1.5 mb-2 outline-none focus:border-blue-400 text-gray-900"
                />
                <div className="flex flex-col gap-0.5">
                  {filteredLocationEntries.length === 0 && (
                    <p className="text-xs text-gray-500 px-2.5 py-2">No cities match.</p>
                  )}
                  {filteredLocationEntries.map(([loc, count]) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => selectLocation(loc)}
                      className={`flex justify-between items-center gap-2 px-2.5 py-2 rounded text-sm text-left ${
                        location === loc ? "bg-blue-50 text-blue-800 font-semibold" : "text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{loc}</span>
                      <span className={`flex-shrink-0 ${location === loc ? "text-blue-800 text-xs" : "text-gray-500 text-xs"}`}>{count}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </aside>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900 mb-4">
              {total} job{total === 1 ? "" : "s"}{q ? ` for "${q}"` : ""}{location ? ` in ${location}` : ""}{category ? ` in ${category}` : ""}
            </h1>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {loading && <p className="text-gray-500 text-sm">Loading listings…</p>}

            {!loading && !error && (
              <div className="flex flex-col gap-3">
                {jobs.length === 0 && (
                  <p className="text-gray-500 text-sm">No jobs match your search. Try different keywords or clear a filter.</p>
                )}
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    showSave={user?.role === "applicant"}
                    isSaved={savedIds.has(job._id)}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}

            {pages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-6 text-sm">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="bg-white border border-gray-200 rounded px-3.5 py-2 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-blue-700 enabled:hover:text-blue-700"
                >
                  Previous
                </button>
                <span>Page {page} of {pages}</span>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="bg-white border border-gray-200 rounded px-3.5 py-2 text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:border-blue-700 enabled:hover:text-blue-700"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}