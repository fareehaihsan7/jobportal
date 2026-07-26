import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

const CATEGORIES = ["Engineering", "Design", "Marketing", "Sales", "Operations", "Other"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

const inputClass = "px-3 py-2.5 border border-gray-200 rounded-md bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-blue-700";
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-gray-900";

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
    <div className="max-w-[700px] mx-auto px-6 py-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{id ? "Edit listing" : "Post a new job"}</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white border border-gray-200 rounded-lg p-6">
        <label className={labelClass}>
          Job title
          <input required value={form.title} onChange={update("title")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Description
          <textarea required rows={5} value={form.description} onChange={update("description")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Requirements (one per line)
          <textarea rows={4} value={form.requirements} onChange={update("requirements")} className={inputClass} />
        </label>
        <div className="flex gap-4 flex-wrap">
          <label className={`${labelClass} flex-1 min-w-[150px]`}>
            Category
            <select value={form.category} onChange={update("category")} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className={`${labelClass} flex-1 min-w-[150px]`}>
            Type
            <select value={form.type} onChange={update("type")} className={inputClass}>
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="flex gap-4 flex-wrap items-end">
          <label className={`${labelClass} flex-1 min-w-[150px]`}>
            Location
            <input required value={form.location} onChange={update("location")} placeholder="e.g. Lahore, PK" className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-900 pb-2.5">
            <input type="checkbox" checked={form.remote} onChange={update("remote")} />
            Remote position
          </label>
        </div>
        <div className="flex gap-4 flex-wrap">
          <label className={`${labelClass} flex-1 min-w-[120px]`}>
            Salary min
            <input type="number" value={form.salaryMin} onChange={update("salaryMin")} className={inputClass} />
          </label>
          <label className={`${labelClass} flex-1 min-w-[120px]`}>
            Salary max
            <input type="number" value={form.salaryMax} onChange={update("salaryMax")} className={inputClass} />
          </label>
          <label className={`${labelClass} flex-1 min-w-[120px]`}>
            Currency
            <input value={form.currency} onChange={update("currency")} className={inputClass} />
          </label>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed self-start"
        >
          {loading ? "Saving…" : id ? "Save changes" : "Publish listing"}
        </button>
      </form>
    </div>
  );
}
