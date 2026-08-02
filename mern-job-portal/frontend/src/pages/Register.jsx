import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { validateEmail, validatePassword, validateRequired, validateConfirmPassword , validateUsername,} from "../utils/validators.js";
import EyeIcon from "../components/EyeIcon.jsx";
import {
  FiUser,
  FiMail,
  FiLock,
  FiBriefcase,
} from "react-icons/fi";

const baseInput = "px-3 py-2.5 border rounded-md bg-white text-sm text-gray-900 w-full focus:outline-none focus:ring-2 transition";
const okInput = `${baseInput} border-gray-200 focus:ring-blue-700 focus:border-blue-700`;
const errInput = `${baseInput} border-red-400 focus:ring-red-400 focus:border-red-400`;
const labelClass = "flex flex-col gap-1.5 text-sm font-medium text-gray-900";
const fieldError = "text-red-600 text-xs -mt-1";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("applicant");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", companyName: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  const blur = (field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const errors = {
    name: validateUsername(form.name),
    email: validateEmail(form.email),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.confirmPassword, form.password),
    ...(role === "employer" ? { companyName: validateRequired(form.companyName, "Company name") } : {}),
  };

  const showError = (field) => touched[field] && errors[field];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allFields = role === "employer"
      ? ["name", "email", "password", "confirmPassword", "companyName"]
      : ["name", "email", "password", "confirmPassword"];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));
    if (allFields.some((f) => errors[f])) return;

    setApiError("");
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const user = await register({ ...payload, role });
      navigate(user.role === "employer" ? "/dashboard" : "/jobs");
    } catch (err) {
      setApiError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 flex items-center justify-center px-6 py-10">
    <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

      {/* Left Side */}

      <div className="hidden lg:flex flex-col justify-center px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            💼
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Job<span className="text-blue-600">Portal</span>
            </h1>

            <p className="text-gray-500">
              Find opportunities. Build your future.
            </p>
          </div>
        </div>

        <h2 className="text-6xl font-bold text-slate-900 leading-tight">
          Find the job
          <br />
          that fits
          <br />
          your life
        </h2>

        <p className="text-xl text-gray-600 mt-6 max-w-lg">
          Join thousands of professionals and companies using
          JobPortal to connect and grow together.
        </p>

        <img
          src="/register-illustration.png"
          alt="Register illustration"
          className="mt-12 w-[520px]"
        />
      </div>

      {/* Right Side */}

      <div className="flex justify-center">
        <div className="w-full max-w-[540px] bg-white rounded-[32px] shadow-2xl p-10 border border-white/40">

          <h2 className="text-5xl font-bold text-slate-900">
            Create an account
          </h2>

          <p className="text-gray-500 text-lg mt-3 mb-8">
            Join thousands of professionals.
          </p>

          <div className="flex bg-gray-100 rounded-2xl p-1.5 mb-8">
            <button
              type="button"
              onClick={() => setRole("applicant")}
              className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition ${
                role === "applicant"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500"
              }`}
            >
              👤 I'm looking for work
            </button>

            <button
              type="button"
              onClick={() => setRole("employer")}
              className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition ${
                role === "employer"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-500"
              }`}
            >
              💼 I'm hiring
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-5"
          >

            {/* Full name */}

            <label className={labelClass}>
              Full name

              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  value={form.name}
                  onChange={update("name")}
                  onBlur={blur("name")}
                  placeholder="Enter your full name"
                  className={`${
                    showError("name") ? errInput : okInput
                  } pl-12`}
                />
              </div>

              {showError("name") && (
                <span className={fieldError}>
                  {errors.name}
                </span>
              )}
            </label>

            {/* Email */}

            <label className={labelClass}>
              Email

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  onBlur={blur("email")}
                  placeholder="Enter your email"
                  className={`${
                    showError("email") ? errInput : okInput
                  } pl-12`}
                />
              </div>

              {showError("email") && (
                <span className={fieldError}>
                  {errors.email}
                </span>
              )}
            </label>

            {/* Password */}

            <label className={labelClass}>
              Password

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  onBlur={blur("password")}
                  placeholder="Create a password"
                  className={`${
                    showError("password") ? errInput : okInput
                  } pl-12 pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              <span className="text-xs text-gray-400">
                At least 6 characters
              </span>
            </label>

            {/* Confirm password */}

            <label className={labelClass}>
              Confirm password

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={form.confirmPassword}
                  onChange={update("confirmPassword")}
                  onBlur={blur("confirmPassword")}
                  placeholder="Confirm your password"
                  className={`${
                    showError("confirmPassword")
                      ? errInput
                      : okInput
                  } pl-12 pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (v) => !v
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeIcon open={showConfirmPassword} />
                </button>
              </div>

              {showError("confirmPassword") && (
                <span className={fieldError}>
                  {errors.confirmPassword}
                </span>
              )}
            </label>

            {role === "employer" && (
              <label className={labelClass}>
                Company name

                <div className="relative">
                  <FiBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                  <input
                    value={form.companyName}
                    onChange={update("companyName")}
                    onBlur={blur("companyName")}
                    placeholder="Company name"
                    className={`${
                      showError("companyName")
                        ? errInput
                        : okInput
                    } pl-12`}
                  />
                </div>

                {showError("companyName") && (
                  <span className={fieldError}>
                    {errors.companyName}
                  </span>
                )}
              </label>
            )}

            {apiError && (
              <p className="text-red-500 text-sm">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold transition"
            >
              {loading
                ? "Creating account..."
                : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  </div>
);
};