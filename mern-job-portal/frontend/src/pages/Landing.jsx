
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Code2,
  PenTool,
  Megaphone,
  TrendingUp,
  Briefcase,
  Sparkles,
} from "lucide-react";

import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import CompaniesSlider from "../components/CompaniesSlider.jsx";

const CATEGORIES = [
  { name: "Engineering", icon: Code2 },
  { name: "Design", icon: PenTool },
  { name: "Marketing", icon: Megaphone },
  { name: "Sales", icon: TrendingUp },
  { name: "Operations", icon: Briefcase },
  { name: "Other", icon: Sparkles },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [counts, setCounts] = useState({});

  useEffect(() => {
    api
      .get("/jobs/categories/counts")
      .then((res) => setCounts(res.data.counts))
      .catch(() => {});
  }, []);

  const totalJobs = Object.values(counts).reduce(
    (sum, n) => sum + n,
    0
  );

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (q) params.set("q", q);

    if (location) params.set("location", location);

    navigate(
      `/jobs${
        params.toString()
          ? `?${params.toString()}`
          : ""
      }`
    );
  };

  const goToCategory = (name) => {
    navigate(
      `/jobs?category=${encodeURIComponent(name)}`
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-white to-blue-50">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 pt-20 pb-24 text-center">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
            Find the job that fits your life
          </h1>

          <p className="text-blue-100 text-lg mt-4">
            {totalJobs > 0
              ? `${totalJobs} open roles`
              : "New roles"}{" "}
            from real companies, updated daily.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-8 bg-white rounded-xl flex flex-col sm:flex-row shadow-2xl overflow-hidden"
          >
            <div className="flex-1 flex items-center gap-2 px-4 py-4 border-b sm:border-b-0 sm:border-r border-gray-200">
              <input
                type="text"
                placeholder="Job title or company"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <div className="flex-1 flex items-center gap-2 px-4 py-4">
              <input
                type="text"
                placeholder="City or Remote"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full outline-none"
              />
            </div>

            <button className="bg-blue-700 text-white px-8 py-4 font-semibold hover:bg-blue-800">
              Search Jobs
            </button>
          </form>

          {!user && (
            <p className="text-blue-100 mt-5">
              Hiring instead?{" "}
              <Link
                to="/register"
                className="text-white underline font-semibold"
              >
                Post a job as an employer →
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-blue-50 py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center text-blue-950">
            Popular Categories
          </h2>

          <p className="text-blue-600 text-center mt-3 mb-12">
            Jump straight into the roles you care about
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;

              return (
                <button
                  key={c.name}
                  onClick={() => goToCategory(c.name)}
                  className="group bg-white border border-blue-100 rounded-2xl p-8 text-left hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-all">
                    <Icon
                      size={28}
                      className="text-blue-600 group-hover:text-white"
                    />
                  </div>

                  <h3 className="text-2xl font-semibold text-blue-950">
                    {c.name}
                  </h3>

                  <p className="mt-2 text-blue-600">
                    {counts[c.name] || 0} open roles
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Companies */}
      <section className="bg-white py-20">
        <CompaniesSlider />
      </section>

      {/* How It Works */}
      <section className="bg-blue-50 border-y border-blue-100 px-6 py-20">
        <div className="max-w-5xl mx-auto">

          <h2 className="text-4xl font-bold text-center text-blue-950 mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <Step
              number="1"
              title="Search & Browse"
              text="Filter by category, location, or job type."
            />

            <Step
              number="2"
              title="Apply in Minutes"
              text="Upload your resume and apply instantly."
            />

            <Step
              number="3"
              title="Track Status"
              text="Monitor all your applications."
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white">
              Trusted by Thousands
            </h2>

            <p className="text-blue-100 mt-4 text-lg">
              Connecting talented professionals with top companies.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard emoji="👨‍💼" number="12K+" label="Candidates" />

            <StatCard emoji="🏢" number="500+" label="Companies" />

            <StatCard
              emoji="💼"
              number={totalJobs || "8K+"}
              label="Jobs Posted"
            />

            <StatCard emoji="⭐" number="98%" label="Success Rate" />

          </div>
        </div>
      </section>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md text-center">
      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-4">
        {number}
      </div>

      <h3 className="font-semibold text-xl text-blue-950 mb-3">
        {title}
      </h3>

      <p className="text-blue-600">
        {text}
      </p>
    </div>
  );
}

function StatCard({ emoji, number, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20">
      <div className="text-5xl mb-4">{emoji}</div>

      <h3 className="text-4xl font-bold text-white">
        {number}
      </h3>

      <p className="text-blue-100 mt-2">
        {label}
      </p>
    </div>
  );
}