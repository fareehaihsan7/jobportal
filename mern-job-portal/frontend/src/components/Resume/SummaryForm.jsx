import React from "react";

export default function SummaryForm({ resume, setResume }) {
  const handleChange = (e) => {
    setResume({
      ...resume,
      summary: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800">
          Professional Summary
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Write a short summary that highlights your experience, skills, and
          career goals.
        </p>
      </div>

      <textarea
        rows={8}
        value={resume.summary}
        onChange={handleChange}
        placeholder="Example:

Passionate MERN Stack Developer with experience in building responsive web applications using MongoDB, Express.js, React.js, and Node.js. Skilled in developing REST APIs, authentication systems, and modern user interfaces. Seeking an opportunity to contribute to innovative software solutions while continuously improving technical skills."
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition"
      />

      <div className="flex justify-between items-center mt-3">
        <p className="text-sm text-gray-500">
          Recommended: 50–150 words
        </p>

        <span className="text-sm font-medium text-gray-600">
          {resume.summary.length} Characters
        </span>
      </div>
    </div>
  );
}