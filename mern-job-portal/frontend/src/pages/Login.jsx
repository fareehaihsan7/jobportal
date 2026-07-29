import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { validateEmail, validateRequired } from "../utils/validators.js";
import EyeIcon from "../components/EyeIcon.jsx";
import { FiMail, FiLock } from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";

const baseInput =
  "px-3.5 py-3 border rounded-md bg-white text-sm text-gray-900 w-full focus:outline-none focus:ring-2 transition";

const okInput = `${baseInput} border-gray-300 focus:ring-teal-600 focus:border-teal-600`;

const errInput = `${baseInput} border-red-400 focus:ring-red-400 focus:border-red-400`;

const labelClass =
  "block text-sm font-medium text-gray-700 mb-1.5";

const fieldError = "text-red-600 text-xs mt-1";

export default function Login() {
  const { login, googleLogin } = useAuth();

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const [apiError, setApiError] = useState("");

  const [touched, setTouched] = useState({});

  const errors = {
    email: validateEmail(email),
    password: validateRequired(password, "Password"),
  };

  const showError = (field) =>
    touched[field] && errors[field];

  const handleBlur = (field) =>
    setTouched((t) => ({
      ...t,
      [field]: true,
    }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    if (errors.email || errors.password) return;

    setLoading(true);
    setApiError("");

    try {
      const user = await login(email, password);

      navigate(
        user.role === "employer"
          ? "/dashboard"
          : "/jobs"
      );
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse
  ) => {
    try {
      const user = await googleLogin(
        credentialResponse.credential
      );

      navigate(
        user.role === "employer"
          ? "/dashboard"
          : "/jobs"
      );
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Google login failed"
      );
    }
  };

  const handleGoogleError = () => {
    setApiError("Google Sign-In failed.");
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-slate-100 flex items-center justify-center px-6 py-10">
    <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-center px-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
            💼
          </div>

          <div>
            <h1 className="text-4xl font-bold">
              Job<span className="text-blue-600">Portal</span>
            </h1>

            <p className="text-gray-500">Welcome back.</p>
          </div>
        </div>

        <h2 className="text-6xl font-bold text-slate-900 leading-tight">
          Continue
          <br />
          your career
          <br />
          journey
        </h2>

        <p className="text-xl text-gray-600 mt-6 max-w-lg">
          Log in to access jobs, applications and opportunities.
        </p>

        <img
          src="/register-illustration.png"
          alt="Illustration"
          className="mt-12 w-[520px]"
        />
      </div>

      {/* Login Card */}
      <div className="flex justify-center">
        <div className="w-full max-w-[500px] bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/50 p-10">
          <h2 className="text-5xl font-bold text-slate-900">Welcome back</h2>

          <p className="text-gray-500 mt-3 mb-8">Sign in to your account.</p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className={labelClass}>Email Address</label>

              <div className="relative mt-1">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur("email")}
                  placeholder="Enter your email"
                  className={`${showError("email") ? errInput : okInput} pl-12`}
                />
              </div>

              {showError("email") && (
                <p className={fieldError}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className={labelClass}>Password</label>

              <div className="relative mt-1">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur("password")}
                  placeholder="Enter your password"
                  className={`${showError("password") ? errInput : okInput} pl-12 pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {showError("password") && (
                <p className={fieldError}>{errors.password}</p>
              )}
            </div>

            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                width="380"
              />
            </div>

            <p className="text-center text-gray-500 mt-8">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};