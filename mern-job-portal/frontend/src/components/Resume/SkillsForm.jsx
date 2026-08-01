import React, { useState } from "react";

export default function SkillsForm({ resume, setResume }) {
  const [skill, setSkill] = useState("");

  const addSkill = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = skill.trim();

      if (!value) return;

      if (resume.skills.includes(value)) {
        setSkill("");
        return;
      }

      setResume({
        ...resume,
        skills: [...resume.skills, value],
      });

      setSkill("");
    }
  };

  const removeSkill = (index) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Skills
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-5">
        Press Enter after each skill.
      </p>

      <input
        type="text"
        placeholder="React"
        value={skill}
        onChange={(e) => setSkill(e.target.value)}
        onKeyDown={addSkill}
        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex flex-wrap gap-2 mt-5">
        {resume.skills.map((item, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {item}

            <button
              onClick={() => removeSkill(index)}
              className="font-bold hover:text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}