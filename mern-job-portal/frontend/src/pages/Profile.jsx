import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api, { resolveFileUrl } from "../api/axios.js";

export default function EditProfile() {
    const { user, setUser, loading } = useAuth();
    const navigate = useNavigate();

    // --- ALL hooks must run unconditionally, before any early return ---

    const [form, setForm] = useState({
        name: "",
        headline: "",
        phone: "",
        location: "",
        skills: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    // Resume upload (applicant)
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [resumeMessage, setResumeMessage] = useState("");
    const [resumeError, setResumeError] = useState("");

    // Company fields (employer)
    const [companyForm, setCompanyForm] = useState({
        companyName: "",
        companyWebsite: "",
        companyDescription: "",
    });
    const [logoFile, setLogoFile] = useState(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [logoMessage, setLogoMessage] = useState("");
    const [logoError, setLogoError] = useState("");

    // Populate form state once the user is available. Using a plain variable
    // (not useEffect) so it re-syncs correctly if `user` loads after mount.
    const [hydrated, setHydrated] = useState(false);
    if (user && !hydrated) {
        setHydrated(true);
        setForm({
            name: user.name || "",
            headline: user.headline || "",
            phone: user.phone || "",
            location: user.location || "",
            skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
        });
        setCompanyForm({
            companyName: user.companyName || "",
            companyWebsite: user.companyWebsite || "",
            companyDescription: user.companyDescription || "",
        });
    }

    // --- Now it's safe to branch/return conditionally ---

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

    const isEmployer = user.role === "employer";

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleCompanyChange = (field) => (e) => {
        setCompanyForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        setResumeError("");
        setResumeMessage("");
        if (!file) return;

        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
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
            setResumeError(err.response?.data?.message || "Resume upload failed.");
        } finally {
            setUploadingResume(false);
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        setLogoError("");
        setLogoMessage("");
        if (!file) return;

        const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
        if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
            setLogoError("Only JPG, PNG, or WEBP images are allowed.");
            e.target.value = "";
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setLogoError("Logo must be less than 2MB.");
            e.target.value = "";
            return;
        }
        setLogoFile(file);
    };

    const uploadLogo = async () => {
        if (!logoFile) return;
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append("logo", logoFile);
            const res = await api.post("/auth/me/logo", formData);
            setUser(res.data.user);
            setLogoMessage("Logo uploaded successfully.");
            setLogoFile(null);
        } catch (err) {
            setLogoError(err.response?.data?.message || "Logo upload failed.");
        } finally {
            setUploadingLogo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            const payload = isEmployer
                ? {
                    companyName: companyForm.companyName,
                    companyWebsite: companyForm.companyWebsite,
                    companyDescription: companyForm.companyDescription,
                }
                : {
                    name: form.name,
                    headline: form.headline,
                    phone: form.phone,
                    location: form.location,
                    skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
                };

            const res = await api.put("/auth/me", payload);
            setUser(res.data.user);

            if (!isEmployer && resumeFile) {
                await uploadResume();
            }
            if (isEmployer && logoFile) {
                await uploadLogo();
            }

            setMessage("Profile updated successfully.");
            setTimeout(() => navigate("/profile"), 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || "Failed to update profile.");
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
                        {isEmployer && user.companyLogoUrl ? (
                            <img
                                src={resolveFileUrl(user.companyLogoUrl)}
                                alt={user.companyName}
                                className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-white text-blue-700 flex items-center justify-center text-4xl font-bold shadow-lg">
                                {(isEmployer ? user.companyName : user.name)?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h1 className="text-4xl font-bold">
                                {isEmployer ? "Company Profile" : "Edit Profile"}
                            </h1>
                            <p className="text-blue-100 mt-2">
                                {isEmployer
                                    ? "Candidates see this on every job you post."
                                    : "Keep your profile updated so employers can discover you."}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">

                    {isEmployer ? (
                        <>
                            {/* Company details */}
                            <div className="bg-gray-50 rounded-2xl p-6 border">
                                <h2 className="text-xl font-bold text-gray-800 mb-5">Company Information</h2>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Company Name</label>
                                        <input
                                            type="text"
                                            value={companyForm.companyName}
                                            onChange={handleCompanyChange("companyName")}
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Website</label>
                                        <input
                                            type="text"
                                            value={companyForm.companyWebsite}
                                            onChange={handleCompanyChange("companyWebsite")}
                                            placeholder="https://…"
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">About the company</label>
                                        <textarea
                                            rows={4}
                                            value={companyForm.companyDescription}
                                            onChange={handleCompanyChange("companyDescription")}
                                            placeholder="A few lines candidates will see on your job listings…"
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Company logo */}
                            <div className="bg-gray-50 rounded-2xl p-6 border">
                                <h2 className="text-xl font-bold text-gray-800 mb-5">Company Logo</h2>

                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleLogoChange}
                                    className="block w-full text-sm border rounded-xl p-3"
                                />

                                {logoError && <p className="text-red-600 mt-2 text-sm">{logoError}</p>}
                                {logoMessage && <p className="text-green-700 mt-2 text-sm">{logoMessage}</p>}

                                {logoFile && (
                                    <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl p-4">
                                        <div>
                                            <p className="font-semibold text-blue-700">{logoFile.name}</p>
                                            <p className="text-xs text-gray-500">{(logoFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={uploadLogo}
                                            disabled={uploadingLogo}
                                            className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800"
                                        >
                                            {uploadingLogo ? "Uploading..." : "Upload Logo"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Personal Information */}
                            <div className="bg-gray-50 rounded-2xl p-6 border">
                                <h2 className="text-xl font-bold text-gray-800 mb-5">Personal Information</h2>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange("name")}
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold mb-2">Phone Number</label>
                                        <input
                                            type="text"
                                            value={form.phone}
                                            onChange={handleChange("phone")}
                                            placeholder="+92 300 1234567"
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Headline</label>
                                        <input
                                            type="text"
                                            value={form.headline}
                                            onChange={handleChange("headline")}
                                            placeholder="Frontend Developer | React | MERN"
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Location</label>
                                        <input
                                            type="text"
                                            value={form.location}
                                            onChange={handleChange("location")}
                                            placeholder="Lahore, Pakistan"
                                            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold mb-2">Skills</label>
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
                                <h2 className="text-xl font-bold text-gray-800 mb-5">Resume</h2>

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
                                    <p className="text-gray-500 mb-5">No resume uploaded yet.</p>
                                )}

                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeChange}
                                    className="block w-full text-sm border rounded-xl p-3"
                                />

                                {resumeError && <p className="text-red-600 mt-2 text-sm">{resumeError}</p>}
                                {resumeMessage && <p className="text-green-700 mt-2 text-sm">{resumeMessage}</p>}

                                {resumeFile && (
                                    <div className="mt-4 flex items-center justify-between bg-blue-50 rounded-xl p-4">
                                        <div>
                                            <p className="font-semibold text-blue-700">{resumeFile.name}</p>
                                            <p className="text-xs text-gray-500">{(resumeFile.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={uploadResume}
                                            disabled={uploadingResume}
                                            className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800"
                                        >
                                            {uploadingResume ? "Uploading..." : "Upload Resume"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {message && (
                        <div
                            className={`rounded-xl p-4 text-center font-medium ${message.toLowerCase().includes("success")
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                                }`}
                        >
                            {message}
                        </div>
                    )}

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
                    {/* <Link
                        to="/resume-builder"
                        className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-2.5 text-white font-medium hover:bg-blue-700 transition"
                    >
                        Resume Builder
                    </Link> */}
                </form>
            </div>

        </div >
    );
}