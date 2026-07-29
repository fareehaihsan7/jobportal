import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import JobCard from "../components/JobCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaBriefcase,
  FaFilter,
  FaLayerGroup,
  FaBuilding,
  FaGlobe,
  FaBookmark,
} from "react-icons/fa";

const CATEGORIES = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Operations",
  "Other",
].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));

const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const chipClass = (active) =>
  `px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
    active
      ? "bg-white text-blue-700 shadow-md"
      : "bg-white/20 text-white hover:bg-white/30"
  }`;

export default function Jobs() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  /* ===========================
        JOB DATA
  =========================== */

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);

  /* ===========================
        SEARCH
  =========================== */

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(
    searchParams.get("location") || ""
  );

  const [category, setCategory] = useState(
    searchParams.get("category") || ""
  );

  const [type, setType] = useState("");
  const [remote, setRemote] = useState(false);

  const [searchTrigger, setSearchTrigger] = useState(0);

  /* ===========================
        FILTER COUNTS
  =========================== */

  const [categoryCounts, setCategoryCounts] = useState({});
  const [locationCounts, setLocationCounts] = useState({});

  const [categorySearch, setCategorySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");

  /* ===========================
        SAVED JOBS
  =========================== */

  const [savedIds, setSavedIds] = useState(new Set());

  /* ===========================
        FETCH JOBS
  =========================== */

  const fetchJobs = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 8,
      };

      if (q.trim()) params.q = q;
      if (location.trim()) params.location = location;
      if (category) params.category = category;
      if (type) params.type = type;
      if (remote) params.remote = true;

      const res = await api.get("/jobs", { params });

      setJobs(res.data.jobs);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch (err) {
      setError("Could not load job listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ===========================
        SAVE JOB
  =========================== */

  const handleToggleSave = async (jobId) => {
    setSavedIds((prev) => {
      const next = new Set(prev);

      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }

      return next;
    });

    try {
      await api.post(`/jobs/${jobId}/save`);
    } catch {
      // Rollback if request fails
      setSavedIds((prev) => {
        const next = new Set(prev);

        if (next.has(jobId)) {
          next.delete(jobId);
        } else {
          next.add(jobId);
        }

        return next;
      });
    }
  };

  /* ===========================
        SEARCH
  =========================== */

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchTrigger((prev) => prev + 1);
  };

  /* ===========================
        CATEGORY FILTER
  =========================== */

  const selectCategory = (selectedCategory) => {
    setCategory((current) =>
      current === selectedCategory ? "" : selectedCategory
    );

    setPage(1);
  };

  /* ===========================
        LOCATION FILTER
  =========================== */

  const selectLocation = (selectedLocation) => {
    setLocation((current) =>
      current === selectedLocation ? "" : selectedLocation
    );

    setPage(1);
  };

  /* ===========================
        TYPE FILTER
  =========================== */

  const toggleChip = (value, current, setter) => {
    setter(current === value ? "" : value);
    setPage(1);
  };

  /* ===========================
        STATISTICS
  =========================== */

  const totalOpenJobs = Object.values(categoryCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const sortedLocationEntries = Object.entries(locationCounts).sort(
    ([a], [b]) =>
      a.localeCompare(b, undefined, {
        sensitivity: "base",
      })
  );

  const filteredCategories = CATEGORIES.filter((category) =>
    category.toLowerCase().includes(
      categorySearch.trim().toLowerCase()
    )
  );

  const filteredLocationEntries = sortedLocationEntries.filter(([city]) =>
    city.toLowerCase().includes(citySearch.trim().toLowerCase())
  );

  /* ===========================
        FETCH COUNTS
  =========================== */

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [categoryRes, locationRes] = await Promise.all([
          api.get("/jobs/categories/counts"),
          api.get("/jobs/locations/counts"),
        ]);

        setCategoryCounts(categoryRes.data.counts);
        setLocationCounts(locationRes.data.counts);
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };

    fetchCounts();
  }, []);

  /* ===========================
        FETCH SAVED JOBS
  =========================== */

  useEffect(() => {
    if (user?.role !== "applicant") return;

    const fetchSavedJobs = async () => {
      try {
        const res = await api.get("/jobs/saved/mine");

        setSavedIds(
          new Set(
            res.data.jobs.map((job) => job._id)
          )
        );
      } catch (err) {
        console.error("Failed to fetch saved jobs", err);
      }
    };

    fetchSavedJobs();
  }, [user]);

  /* ===========================
        FETCH JOBS
  =========================== */

  useEffect(() => {
    fetchJobs();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    category,
    location,
    type,
    remote,
    searchTrigger,
  ]);

  /* ===========================
        RESET PAGE
  =========================== */

  useEffect(() => {
    setPage(1);
  }, [
    category,
    location,
    type,
    remote,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ================= HERO SECTION ================= */}

      <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">

        {/* Background Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-400/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">

          {/* Heading */}
          <div className="text-center text-white">
            <h1 className="text-5xl font-extrabold">Find Your Dream Job</h1>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Explore thousands of verified opportunities from top companies.
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="bg-white rounded-3xl shadow-2xl p-4 mt-12 grid lg:grid-cols-3 gap-4"
          >
            <div className="flex items-center gap-4 border rounded-2xl px-5 py-4">
              <FaSearch className="text-blue-600 text-xl" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title or company"
                className="flex-1 outline-none"
              />
            </div>

            <div className="flex items-center gap-4 border rounded-2xl px-5 py-4">
              <FaMapMarkerAlt className="text-red-500 text-xl" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="flex-1 outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 rounded-2xl text-white font-semibold"
            >
              Search Jobs
            </button>
          </form>

          {/* Job Types */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => toggleChip(t, type, setType)}
                className={chipClass(type === t)}
              >
                {t}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setRemote(!remote)}
              className={chipClass(remote)}
            >
              Remote
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <p className="text-4xl font-bold text-blue-700">{totalOpenJobs}</p>
              <p className="text-gray-500 mt-2">Open Jobs</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <p className="text-4xl font-bold text-blue-700">
                {Object.keys(categoryCounts).length}
              </p>
              <p className="text-gray-500 mt-2">Categories</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <p className="text-4xl font-bold text-blue-700">
                {Object.keys(locationCounts).length}
              </p>
              <p className="text-gray-500 mt-2">Cities</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <p className="text-4xl font-bold text-blue-700">{total}</p>
              <p className="text-gray-500 mt-2">Results</p>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Explore Opportunities</h2>
            <p className="text-gray-500 mt-2">
              Showing
              <span className="font-semibold text-blue-700 mx-1">{total}</span>
              available jobs
              {q && (
                <>
                  {" "}for{" "}
                  <span className="font-semibold text-gray-800">"{q}"</span>
                </>
              )}
            </p>
          </div>

          <div className="mt-6 lg:mt-0">
            <div className="bg-white rounded-xl shadow px-4 py-3 flex items-center gap-2">
              <FaBriefcase className="text-blue-600" />
              <span className="font-medium">Page {page} of {pages}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-8 items-start">

          {/* ================= SIDEBAR (Filters) ================= */}

          <aside className="sticky top-24">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <FaFilter className="text-xl" />
                  <div>
                    <h2 className="font-bold text-lg">Filters</h2>
                    <p className="text-blue-100 text-sm">Narrow your search</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">

                {/* ================= Categories ================= */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaLayerGroup className="text-blue-700" />
                    <h3 className="font-semibold text-gray-800">Categories</h3>
                  </div>

                  <input
                    type="text"
                    placeholder="Search category..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600"
                  />

                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    <button
                      type="button"
                      onClick={() => selectCategory("")}
                      className={`w-full flex justify-between items-center rounded-xl px-4 py-3 transition ${
                        category === ""
                          ? "bg-blue-50 text-blue-700 font-semibold"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span>All Categories</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                        {totalOpenJobs}
                      </span>
                    </button>

                    {filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => selectCategory(cat)}
                        className={`w-full flex justify-between items-center rounded-xl px-4 py-3 transition ${
                          category === cat
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span>{cat}</span>
                        <span className="text-sm text-gray-500">
                          {categoryCounts[cat] || 0}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ================= Cities ================= */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-red-500" />
                    <h3 className="font-semibold text-gray-800">Locations</h3>
                  </div>

                  <input
                    type="text"
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-600"
                  />

                  <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
                    {filteredLocationEntries.map(([city, count]) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => selectLocation(city)}
                        className={`w-full flex justify-between items-center rounded-xl px-4 py-3 transition ${
                          location === city
                            ? "bg-blue-50 text-blue-700 font-semibold"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <span className="truncate">{city}</span>
                        <span className="text-sm text-gray-500">{count}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ================= Remote ================= */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <FaGlobe className="text-green-600" />
                    <h3 className="font-semibold text-gray-800">Work Mode</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRemote(!remote)}
                    className={`w-full rounded-xl py-3 transition font-semibold ${
                      remote
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {remote ? "✓ Remote Only" : "Remote Jobs"}
                  </button>
                </div>

              </div>
            </div>
          </aside>

          {/* ================= JOBS LIST ================= */}

          <div>
            {loading && (
              <p className="text-center text-gray-500 py-10">Loading jobs...</p>
            )}

            {error && (
              <p className="text-center text-red-600 py-10">{error}</p>
            )}

            {!loading && !error && jobs.length === 0 && (
              <p className="text-center text-gray-500 py-10">
                No jobs found matching your search.
              </p>
            )}

            {!loading && !error && jobs.length > 0 && (
              <div className="grid gap-6">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSaved={savedIds.has(job._id)}
                    onToggleSave={() => handleToggleSave(job._id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-xl border disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-gray-600">
                  Page {page} of {pages}
                </span>

                <button
                  type="button"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                  className="px-4 py-2 rounded-xl border disabled:opacity-40"
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