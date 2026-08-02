import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const CATEGORIES = ["Engineering", "Design", "Marketing", "Sales", "Operations", "Other"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];


const labelClass =
  "flex flex-col gap-2 text-sm font-medium text-gray-700";

const inputClass =
  "w-full rounded-xl border border-gray-300 px-4 py-3 bg-gray-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition";
const emptyForm = {
  title: "",
  description: "",
  requirements: "",
  category: "Engineering",
  type: "Full-time",
  location: "",
  remote: false,
  salaryMin: "",
  salaryMax: "",
  currency: "PKR",
};

export default function PostJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    api.get(`/jobs/${id}`).then((res) => {
      const j = res.data.job;
      setForm({
        ...j,
        requirements: (j.requirements || []).join("\n"),
        salaryMin: j.salaryMin || "",
        salaryMax: j.salaryMax || "",
      });
    });
  }, [id]);

  const update = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split("\n").map((r) => r.trim()).filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      };
      if (id) {
        await api.put(`/jobs/${id}`, payload);
      } else {
        await api.post("/jobs", payload);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save job listing");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="max-w-5xl mx-auto px-4">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-3xl font-bold">
          {id ? "Edit Job Listing" : "Post a New Job"}
        </h1>
        <p className="mt-2 text-blue-100">
          Fill in the details below to attract the best candidates.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-lg p-8 space-y-8"
      >
        {/* Job Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2">
            Job Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <label className={labelClass}>
              Job Title
              <input
                required
                value={form.title}
                onChange={update("title")}
                className={inputClass}
                placeholder="Senior MERN Stack Developer"
              />
            </label>

            <label className={labelClass}>
              Location
              <input
                required
                value={form.location}
                onChange={update("location")}
                className={inputClass}
                placeholder="Lahore, Pakistan"
              />
            </label>

            <label className={labelClass}>
              Category
              <select
                value={form.category}
                onChange={update("category")}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Job Type
              <select
                value={form.type}
                onChange={update("type")}
                className={inputClass}
              >
                {TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>

          </div>
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2">
            Description
          </h2>

          <label className={labelClass}>
            Job Description
            <textarea
              rows={6}
              required
              value={form.description}
              onChange={update("description")}
              className={inputClass}
              placeholder="Describe the responsibilities, technologies, and expectations..."
            />
          </label>

          <label className={`${labelClass} mt-6`}>
            Requirements
            <textarea
              rows={5}
              value={form.requirements}
              onChange={update("requirements")}
              className={inputClass}
              placeholder="Bachelor's Degree&#10;2+ Years Experience&#10;React.js&#10;Node.js"
            />
          </label>
        </div>

        {/* Salary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-5 border-b pb-2">
            Salary Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <label className={labelClass}>
              Minimum Salary
              <input
                type="number"
                value={form.salaryMin}
                onChange={update("salaryMin")}
                className={inputClass}
                placeholder="50000"
              />
            </label>

            <label className={labelClass}>
              Maximum Salary
              <input
                type="number"
                value={form.salaryMax}
                onChange={update("salaryMax")}
                className={inputClass}
                placeholder="120000"
              />
            </label>

            <label className={labelClass}>
              Currency
              <input
                value={form.currency}
                onChange={update("currency")}
                className={inputClass}
                placeholder="PKR"
              />
            </label>

          </div>
        </div>

        {/* Remote */}
        <div className="flex items-center bg-blue-50 border border-blue-100 rounded-xl p-4">
          <input
            id="remote"
            type="checkbox"
            checked={form.remote}
            onChange={update("remote")}
            className="h-5 w-5 accent-blue-600"
          />

          <label
            htmlFor="remote"
            className="ml-3 text-gray-700 font-medium"
          >
            This is a Remote Position
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
            {error}
          </div>
        )}

        {/* Button */}
        <div className="flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : id
              ? "Save Changes"
              : "Publish Job"}
          </button>

        </div>

      </form>
    </div>
  </div>
);
}
