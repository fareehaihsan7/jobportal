import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("jp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Uploaded files (resumes) are returned as paths like "/uploads/resumes/x.pdf",
// relative to the API's origin rather than "/api". This turns them into a
// full URL the browser can open directly.
export const FILE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
export const resolveFileUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//.test(url)) return url;
  return `${FILE_BASE_URL}${url}`;
};

export default api;
