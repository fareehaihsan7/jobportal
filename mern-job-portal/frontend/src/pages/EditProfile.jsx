import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api, { resolveFileUrl } from "../api/axios.js";

export default function EditProfile() {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        User not found.
      </div>
    );
  }

  const [form, setForm] = useState({
    name: user.name || "",
    headline: user.headline || "",
    phone: user.phone || "",
    location: user.location || "",
    skills: Array.isArray(user.skills)
      ? user.skills.join(", ")
      : "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Resume Upload
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeMessage, setResumeMessage] = useState("");
  const [resumeError, setResumeError] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    setResumeError("");
    setResumeMessage("");

    if (!file) return;

    const ext = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();

    if (![".pdf", ".doc", ".docx"].includes(ext)) {
      setResumeError("Only PDF, DOC and DOCX files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError("Resume must be less than 5MB.");
      e.target.value = "";
      return;
    }

    setResumeFile(file);
  };

  const uploadResume = async () => {
    if (!resumeFile) return;

    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const res = await api.post("/auth/me/resume", formData);

      setUser(res.data.user);

      setResumeMessage("Resume uploaded successfully.");

      setResumeFile(null);
    } catch (err) {
      setResumeError(
        err.response?.data?.message || "Resume upload failed."
      );
    } finally {
      setUploadingResume(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const res = await api.put("/auth/me", {
        name: form.name,
        headline: form.headline,
        phone: form.phone,
        location: form.location,
        skills: form.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });

      setUser(res.data.user);

      if (resumeFile) {
        await uploadResume();
      }

      setMessage("Profile updated successfully.");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10 px-5">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-10 text-white">

          <div className="flex items-center gap-5">

            <div className="w-24 h-24 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold shadow-lg">

              {user.name?.charAt(0).toUpperCase()}

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                Edit Profile
              </h1>

              <p className="text-blue-100 mt-2">
                Keep your profile updated so employers can discover you.
              </p>

            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6"
        >
                  {/* Personal Information */}

          <div className="bg-gray-50 rounded-2xl p-6 border">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Personal Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>

                <input
                  type="text"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  placeholder="+92 300 1234567"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Headline
                </label>

                <input
                  type="text"
                  value={form.headline}
                  onChange={handleChange("headline")}
                  placeholder="Frontend Developer | React | MERN"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Location
                </label>

                <input
                  type="text"
                  value={form.location}
                  onChange={handleChange("location")}
                  placeholder="Lahore, Pakistan"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Skills
                </label>

                <input
                  type="text"
                  value={form.skills}
                  onChange={handleChange("skills")}
                  placeholder="React, Node.js, MongoDB"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

            </div>

          </div>

          {/* Resume */}

          <div className="bg-gray-50 rounded-2xl p-6 border">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              Resume
            </h2>

            {user.resumeUrl ? (

              <div className="mb-5">

                <a
                  href={resolveFileUrl(user.resumeUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 font-semibold hover:underline"
                >
                  📄 {user.resumeOriginalName || "View Resume"}
                </a>

              </div>

            ) : (

              <p className="text-gray-500 mb-5">
                No resume uploaded yet.
              </p>

            )}

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleResumeChange}
              className="block w-full text-sm border rounded-xl p-3"
            />

            {resumeError && (
              <p className="text-red-600 mt-2 text-sm">
                {resumeError}
              </p>
            )}

            {resumeMessage && (
              <p className="text-green-700 mt-2 text-sm">
                {resumeMessage}
              </p>
            )}

            {resumeFile && (

              <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl p-4">

                <div>

                  <p className="font-semibold text-blue-700">
                    {resumeFile.name}
                  </p>

                  <p className="text-xs text-gray-500">
                    {(resumeFile.size / 1024).toFixed(1)} KB
                  </p>

                </div>

                <button
                  type="button"
                  onClick={uploadResume}
                  disabled={uploadingResume}
                  className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800"
                >
                  {uploadingResume
                    ? "Uploading..."
                    : "Upload Resume"}
                </button>

              </div>

            )}

          </div>          {/* Success / Error Message */}

          {message && (
            <div
              className={`rounded-xl p-4 text-center font-medium ${
                message.toLowerCase().includes("success")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Action Buttons */}

          <div className="flex gap-4 pt-2">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-blue-700 text-white py-4 rounded-xl text-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 border border-gray-300 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>

          </div>
        

        </form>
        

      </div>

    </div>
  );
}