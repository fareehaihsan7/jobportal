// // import React, { useEffect, useState } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import api from "../api/axios.js";
// // import { useAuth } from "../context/AuthContext.jsx";
// // import CompaniesSlider from "../components/CompaniesSlider.jsx";

// // const CATEGORIES = [
// //   { name: "Engineering", icon: "💻" },
// //   { name: "Design", icon: "🎨" },
// //   { name: "Marketing", icon: "📣" },
// //   { name: "Sales", icon: "📈" },
// //   { name: "Operations", icon: "🗂️" },
// //   { name: "Other", icon: "✨" },
// // ];

// // export default function Landing() {
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const [q, setQ] = useState("");
// //   const [location, setLocation] = useState("");
// //   const [counts, setCounts] = useState({});

// //   useEffect(() => {
// //     api.get("/jobs/categories/counts").then((res) => setCounts(res.data.counts)).catch(() => {});
// //   }, []);

// //   const totalJobs = Object.values(counts).reduce((sum, n) => sum + n, 0);

// //   const handleSearch = (e) => {
// //     e.preventDefault();
// //     const params = new URLSearchParams();
// //     if (q) params.set("q", q);
// //     if (location) params.set("location", location);
// //     navigate(`/jobs${params.toString() ? `?${params.toString()}` : ""}`);
// //   };

// //   const goToCategory = (name) => {
// //     navigate(`/jobs?category=${encodeURIComponent(name)}`);
// //   };

// //   return (
// //     <div>
// //       {/* Hero */}
// //       <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 px-6 pt-20 pb-24 text-center">
// //         <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl" />
// //         <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />

// //         <div className="relative max-w-2xl mx-auto">
// //           <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
// //             Find the job that fits your life
// //           </h1>
// //           <p className="text-blue-100 text-lg mt-4">
// //             {totalJobs > 0 ? `${totalJobs} open roles` : "New roles"} from real companies, updated daily.
// //           </p>

// //           <form
// //             onSubmit={handleSearch}
// //             className="mt-8 bg-white rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center shadow-xl overflow-hidden"
// //           >
// //             <div className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-200">
// //               <svg viewBox="0 0 20 20" width="16" height="16" fill="none" className="flex-shrink-0">
// //                 <path d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.42-1.42l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z" fill="#6b7280" />
// //               </svg>
// //               <input
// //                 type="text"
// //                 placeholder="Job title or company"
// //                 value={q}
// //                 onChange={(e) => setQ(e.target.value)}
// //                 className="border-none outline-none text-sm w-full text-gray-900"
// //               />
// //             </div>
// //             <div className="flex-1 flex items-center gap-2 px-4 py-3.5">
// //               <svg viewBox="0 0 20 20" width="16" height="16" fill="none" className="flex-shrink-0">
// //                 <path d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zm0 8.5A2.5 2.5 0 1110 5a2.5 2.5 0 010 5.5z" fill="#6b7280" />
// //               </svg>
// //               <input
// //                 type="text"
// //                 placeholder="City or 'Remote'"
// //                 value={location}
// //                 onChange={(e) => setLocation(e.target.value)}
// //                 className="border-none outline-none text-sm w-full text-gray-900"
// //               />
// //             </div>
// //             <button type="submit" className="bg-blue-700 text-white px-8 py-3.5 text-sm font-semibold hover:bg-blue-800">
// //               Search jobs
// //             </button>
// //           </form>

// //           {!user && (
// //             <p className="text-blue-100 text-sm mt-5">
// //               Hiring instead?{" "}
// //               <Link to="/register" className="text-white font-semibold underline">
// //                 Post a job as an employer →
// //               </Link>
// //             </p>
// //           )}
// //         </div>
// //       </section>

// //       {/* Popular categories */}
// //       <section className="max-w-4xl mx-auto px-6 py-16">
// //         <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Popular categories</h2>
// //         <p className="text-gray-500 text-center mb-8">Jump straight into the roles you care about</p>

// //         <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
// //           {CATEGORIES.map((c) => (
// //             <button
// //               key={c.name}
// //               onClick={() => goToCategory(c.name)}
// //               className="bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-blue-700 hover:shadow-md transition"
// //             >
// //               <div className="text-2xl mb-2">{c.icon}</div>
// //               <div className="font-semibold text-gray-900">{c.name}</div>
// //               <div className="text-xs text-gray-500 mt-1">{counts[c.name] || 0} open roles</div>
// //             </button>
// //           ))}
// //         </div>
// //       </section>

// //       <CompaniesSlider />

// //       {/* How it works */}
// //       <section className="bg-white border-y border-gray-200 px-6 py-16">
// //         <div className="max-w-4xl mx-auto">
// //           <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
// //           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
// //             <Step number="1" title="Search & browse" text="Filter by category, location, or job type to find roles that match what you want." />
// //             <Step number="2" title="Apply in minutes" text="Attach your resume once, then apply to any listing with a single click." />
// //             <Step number="3" title="Track your status" text="Follow every application from submitted through to an offer, all in one place." />
// //           </div>
// //         </div>
// //       </section>

// //       {/* For employers */}
// //       <section className="max-w-4xl mx-auto px-6 py-16 text-center">
// //         <h2 className="text-2xl font-bold text-gray-900 mb-2">Hiring? Reach candidates faster</h2>
// //         <p className="text-gray-500 mb-8 max-w-xl mx-auto">
// //           Post a job in minutes, add your company logo and description, and manage every applicant from one dashboard.
// //         </p>
// //         <Link
// //           to={user?.role === "employer" ? "/post-job" : "/register"}
// //           className="inline-block bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-800 hover:no-underline"
// //         >
// //           {user?.role === "employer" ? "Post a job" : "Get started as an employer"}
// //         </Link>
// //       </section>
// //     </div>
// //   );
// // }

// // function Step({ number, title, text }) {
// //   return (
// //     <div className="text-center sm:text-left">
// //       <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center mx-auto sm:mx-0 mb-3">
// //         {number}
// //       </div>
// //       <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
// //       <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
// //     </div>
// //   );
// // }
// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import {
//   Code2,
//   PenTool,
//   Megaphone,
//   TrendingUp,
//   Briefcase,
//   Sparkles,
// } from "lucide-react";

// import api from "../api/axios.js";
// import { useAuth } from "../context/AuthContext.jsx";
// import CompaniesSlider from "../components/CompaniesSlider.jsx";

// const CATEGORIES = [
//   { name: "Engineering", icon: Code2 },
//   { name: "Design", icon: PenTool },
//   { name: "Marketing", icon: Megaphone },
//   { name: "Sales", icon: TrendingUp },
//   { name: "Operations", icon: Briefcase },
//   { name: "Other", icon: Sparkles },
// ];

// export default function Landing() {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [q, setQ] = useState("");
//   const [location, setLocation] = useState("");
//   const [counts, setCounts] = useState({});

//   useEffect(() => {
//     api
//       .get("/jobs/categories/counts")
//       .then((res) => setCounts(res.data.counts))
//       .catch(() => {});
//   }, []);

//   const totalJobs = Object.values(counts).reduce(
//     (sum, n) => sum + n,
//     0
//   );

//   const handleSearch = (e) => {
//     e.preventDefault();

//     const params = new URLSearchParams();

//     if (q) params.set("q", q);

//     if (location) params.set("location", location);

//     navigate(
//       `/jobs${
//         params.toString()
//           ? `?${params.toString()}`
//           : ""
//       }`
//     );
//   };

//   const goToCategory = (name) => {
//     navigate(
//       `/jobs?category=${encodeURIComponent(name)}`
//     );
//   };

//   return (
//     <div>
//       {/* Hero */}
//       <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 to-blue-900 px-6 pt-20 pb-24 text-center">
//         <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/30 blur-3xl" />
//         <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />

//         <div className="relative max-w-2xl mx-auto">
//           <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
//             Find the job that fits your life
//           </h1>

//           <p className="text-blue-100 text-lg mt-4">
//             {totalJobs > 0
//               ? `${totalJobs} open roles`
//               : "New roles"}{" "}
//             from real companies, updated daily.
//           </p>

//           <form
//             onSubmit={handleSearch}
//             className="mt-8 bg-white rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center shadow-xl overflow-hidden"
//           >
//             <div className="flex-1 flex items-center gap-2 px-4 py-3.5 border-b sm:border-b-0 sm:border-r border-gray-200">
//               <svg
//                 viewBox="0 0 20 20"
//                 width="16"
//                 height="16"
//                 fill="none"
//               >
//                 <path
//                   d="M9 3a6 6 0 104.47 10.03l3.75 3.75a1 1 0 001.42-1.42l-3.75-3.75A6 6 0 009 3zm-4 6a4 4 0 118 0 4 4 0 01-8 0z"
//                   fill="#6b7280"
//                 />
//               </svg>

//               <input
//                 type="text"
//                 placeholder="Job title or company"
//                 value={q}
//                 onChange={(e) =>
//                   setQ(e.target.value)
//                 }
//                 className="border-none outline-none text-sm w-full text-gray-900"
//               />
//             </div>

//             <div className="flex-1 flex items-center gap-2 px-4 py-3.5">
//               <svg
//                 viewBox="0 0 20 20"
//                 width="16"
//                 height="16"
//                 fill="none"
//               >
//                 <path
//                   d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zm0 8.5A2.5 2.5 0 1110 5a2.5 2.5 0 010 5.5z"
//                   fill="#6b7280"
//                 />
//               </svg>

//               <input
//                 type="text"
//                 placeholder="City or 'Remote'"
//                 value={location}
//                 onChange={(e) =>
//                   setLocation(e.target.value)
//                 }
//                 className="border-none outline-none text-sm w-full text-gray-900"
//               />
//             </div>

//             <button
//               type="submit"
//               className="bg-blue-700 text-white px-8 py-3.5 text-sm font-semibold hover:bg-blue-800"
//             >
//               Search jobs
//             </button>
//           </form>

//           {!user && (
//             <p className="text-blue-100 text-sm mt-5">
//               Hiring instead?{" "}
//               <Link
//                 to="/register"
//                 className="text-white font-semibold underline"
//               >
//                 Post a job as an employer →
//               </Link>
//             </p>
//           )}
//         </div>
//       </section>

//       {/* Popular Categories */}
//       <section className="bg-slate-50 py-20">
//         <div className="max-w-6xl mx-auto px-6">
//           <h2 className="text-4xl font-bold text-center text-slate-900">
//             Popular categories
//           </h2>

//           <p className="text-slate-500 text-center mt-3 mb-12">
//             Jump straight into the roles you care about
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {CATEGORIES.map((c) => {
//               const Icon = c.icon;

//               return (
//                 <button
//                   key={c.name}
//                   onClick={() =>
//                     goToCategory(c.name)
//                   }
//                   className="
//                     group
//                     bg-white
//                     border
//                     border-slate-200
//                     rounded-2xl
//                     p-8
//                     text-left
//                     transition-all
//                     duration-300
//                     hover:-translate-y-1
//                     hover:shadow-xl
//                     hover:border-blue-500
//                   "
//                 >
//                   <div
//                     className="
//                       w-14
//                       h-14
//                       rounded-xl
//                       bg-blue-100
//                       flex
//                       items-center
//                       justify-center
//                       mb-5
//                       transition-all
//                       duration-300
//                       group-hover:bg-blue-600
//                     "
//                   >
//                     <Icon
//                       size={28}
//                       className="
//                         text-blue-600
//                         transition-all
//                         duration-300
//                         group-hover:text-white
//                       "
//                     />
//                   </div>

//                   <h3 className="text-2xl font-semibold text-slate-900">
//                     {c.name}
//                   </h3>

//                   <p className="mt-2 text-slate-500">
//                     {counts[c.name] || 0} open
//                     roles
//                   </p>
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </section>

//       <CompaniesSlider />

//       {/* How it works */}
//       <section className="bg-white border-y border-gray-200 px-6 py-16">
//         <div className="max-w-4xl mx-auto">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
//             How it works
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
//             <Step
//               number="1"
//               title="Search & browse"
//               text="Filter by category, location, or job type to find roles that match what you want."
//             />

//             <Step
//               number="2"
//               title="Apply in minutes"
//               text="Attach your resume once, then apply to any listing with a single click."
//             />

//             <Step
//               number="3"
//               title="Track your status"
//               text="Follow every application from submitted through to an offer, all in one place."
//             />
//           </div>
//         </div>
//       </section>

//       {/* Employer
//       <section className="max-w-4xl mx-auto px-6 py-16 text-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-2">
//           Hiring? Reach candidates faster
//         </h2>

//         <p className="text-gray-500 mb-8 max-w-xl mx-auto">
//           Post a job in minutes, add your company logo and
//           description, and manage every applicant from one
//           dashboard.
//         </p>

//         <Link
//           to={
//             user?.role === "employer"
//               ? "/post-job"
//               : "/register"
//           }
//           className="inline-block bg-blue-700 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-blue-800 hover:no-underline"
//         >
//           {user?.role === "employer"
//             ? "Post a job"
//             : "Get started as an employer"}
//         </Link>
//       </section> */}
//       {/* Platform Statistics */}
// <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800">
//   <div className="max-w-6xl mx-auto px-6">

//     <div className="text-center mb-14">
//       <h2 className="text-4xl font-bold text-white">
//         Trusted by Thousands
//       </h2>

//       <p className="text-blue-100 mt-4 text-lg max-w-2xl mx-auto">
//         Connecting talented professionals with top companies around the world.
//       </p>
//     </div>

//     <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

//       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:-translate-y-2 transition duration-300">
//         <div className="text-5xl mb-4">👨‍💼</div>

//         <h3 className="text-4xl font-bold text-white">
//           12K+
//         </h3>

//         <p className="text-blue-100 mt-2">
//           Candidates
//         </p>
//       </div>

//       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:-translate-y-2 transition duration-300">
//         <div className="text-5xl mb-4">🏢</div>

//         <h3 className="text-4xl font-bold text-white">
//           500+
//         </h3>

//         <p className="text-blue-100 mt-2">
//           Companies
//         </p>
//       </div>

//       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:-translate-y-2 transition duration-300">
//         <div className="text-5xl mb-4">💼</div>

//         <h3 className="text-4xl font-bold text-white">
//           {totalJobs || "8K+"}
//         </h3>

//         <p className="text-blue-100 mt-2">
//           Jobs Posted
//         </p>
//       </div>

//       <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center border border-white/20 hover:-translate-y-2 transition duration-300">
//         <div className="text-5xl mb-4">⭐</div>

//         <h3 className="text-4xl font-bold text-white">
//           98%
//         </h3>

//         <p className="text-blue-100 mt-2">
//           Success Rate
//         </p>
//       </div>

//     </div>

//   </div>
// </section>
//     </div>
//   );
// }

// function Step({
//   number,
//   title,
//   text,
// }) {
//   return (
//     <div className="text-center sm:text-left">
//       <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center mx-auto sm:mx-0 mb-3">
//         {number}
//       </div>

//       <h3 className="font-semibold text-gray-900 mb-1">
//         {title}
//       </h3>

//       <p className="text-sm text-gray-500 leading-relaxed">
//         {text}
//       </p>
//     </div>
//   );
// }
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