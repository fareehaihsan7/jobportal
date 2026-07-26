// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api, { resolveFileUrl } from "../api/axios.js";

// export default function CompaniesSlider() {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const scrollRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     api
//       .get("/jobs/companies/featured")
//       .then((res) => setCompanies(res.data.companies))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   const scrollBy = (amount) => {
//     scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
//   };

//   const goToCompany = (companyName) => {
//     navigate(`/jobs?q=${encodeURIComponent(companyName)}`);
//   };

//   if (loading || companies.length === 0) return null;

//   return (
//     <section className="max-w-5xl mx-auto px-6 py-16">
//       <div className="flex items-center justify-between mb-2">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Companies hiring now</h2>
//           <p className="text-gray-500 mt-1">A few of the teams actively growing on TalentHub</p>
//         </div>
//         <div className="hidden sm:flex gap-2">
//           <button
//             type="button"
//             onClick={() => scrollBy(-300)}
//             aria-label="Scroll left"
//             className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-700 hover:text-blue-700"
//           >
//             ‹
//           </button>
//           <button
//             type="button"
//             onClick={() => scrollBy(300)}
//             aria-label="Scroll right"
//             className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-blue-700 hover:text-blue-700"
//           >
//             ›
//           </button>
//         </div>
//       </div>

//       <div
//         ref={scrollRef}
//         className="flex gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar scroll-smooth snap-x snap-mandatory"
//       >
//         {companies.map((c) => (
//           <button
//             key={c._id}
//             onClick={() => goToCompany(c.companyName)}
//             className="snap-start flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg p-5 text-left hover:border-blue-700 hover:shadow-md transition"
//           >
//             {c.companyLogoUrl ? (
//               <img
//                 src={resolveFileUrl(c.companyLogoUrl)}
//                 alt={c.companyName}
//                 className="w-12 h-12 rounded-lg object-cover border border-gray-200 mb-3"
//               />
//             ) : (
//               <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 font-bold text-lg flex items-center justify-center mb-3">
//                 {c.companyName?.[0]?.toUpperCase() || "?"}
//               </div>
//             )}
//             <h3 className="font-semibold text-gray-900">{c.companyName}</h3>
//             <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">
//               {c.companyDescription || "This company hasn't added a description yet."}
//             </p>
//             <p className="text-xs font-semibold text-blue-700 mt-3">
//               {c.openJobs} open role{c.openJobs === 1 ? "" : "s"} →
//             </p>
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { resolveFileUrl } from "../api/axios.js";

export default function CompaniesSlider() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/jobs/companies/featured")
      .then((res) => setCompanies(res.data.companies))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scrollBy = (amount) => {
    scrollRef.current?.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  };

  const goToCompany = (companyName) => {
    navigate(`/jobs?q=${encodeURIComponent(companyName)}`);
  };

  if (loading || companies.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Heading */}

      <div className="mb-12 text-center">
  <h2 className="text-4xl font-bold text-blue-950">
    Companies hiring now
  </h2>

  <p className="text-blue-600 mt-3 text-lg">
    A few of the teams actively growing on TalentHub
  </p>
</div>

      {/* Slider */}

      <div className="relative">
        {/* Left Arrow */}

        <button
          type="button"
          onClick={() => scrollBy(-400)}
          aria-label="Scroll left"
          className="
            hidden
            md:flex
            absolute
            left-0
            top-1/2
            -translate-x-1/2
            -translate-y-1/2
            z-20
            w-12
            h-12
            rounded-full
            bg-white
            border
            border-blue-200
            shadow-lg
            items-center
            justify-center
            text-blue-700
            text-2xl
            hover:bg-blue-700
            hover:text-white
            transition
          "
        >
          ‹
        </button>

        {/* Right Arrow */}

        <button
          type="button"
          onClick={() => scrollBy(400)}
          aria-label="Scroll right"
          className="
            hidden
            md:flex
            absolute
            right-0
            top-1/2
            translate-x-1/2
            -translate-y-1/2
            z-20
            w-12
            h-12
            rounded-full
            bg-white
            border
            border-blue-200
            shadow-lg
            items-center
            justify-center
            text-blue-700
            text-2xl
            hover:bg-blue-700
            hover:text-white
            transition
          "
        >
          ›
        </button>

        {/* Cards */}

        <div
          ref={scrollRef}
          className="
            flex
            gap-6
            overflow-x-auto
            pb-4
            no-scrollbar
            scroll-smooth
            snap-x
            snap-mandatory
          "
        >
          {companies.map((c) => (
            <button
              key={c._id}
              onClick={() => goToCompany(c.companyName)}
              className="
                snap-start
                flex-shrink-0
                w-[340px]
                min-h-[280px]
                bg-blue-100
                border
                border-blue-100
                rounded-2xl
                p-6
                text-left
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-1
                hover:border-blue-500
                transition-all
              "
            >
              {c.companyLogoUrl ? (
                <img
                  src={resolveFileUrl(c.companyLogoUrl)}
                  alt={c.companyName}
                  className="
                    w-16
                    h-16
                    rounded-xl
                    object-cover
                    border
                    border-blue-100
                    mb-5
                  "
                />
              ) : (
                <div
                  className="
                    w-16
                    h-16
                    rounded-xl
                    bg-blue-100
                    text-blue-700
                    font-bold
                    text-2xl
                    flex
                    items-center
                    justify-center
                    mb-5
                  "
                >
                  {c.companyName?.[0]?.toUpperCase() || "?"}
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900">
                {c.companyName}
              </h3>

              <p className="text-gray-500 mt-3 line-clamp-3 text-base">
                {c.companyDescription ||
                  "This company hasn't added a description yet."}
              </p>

              <p className="text-blue-700 font-semibold mt-6">
                {c.openJobs} open role
                {c.openJobs === 1 ? "" : "s"} →
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}