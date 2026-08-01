import React, { useState } from "react";

export default function LanguagesForm({ resume, setResume }) {
  const [language, setLanguage] = useState("");

  const addLanguage = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = language.trim();

      if (!value) return;

      if (resume.languages.includes(value)) {
        setLanguage("");
        return;
      }

      setResume({
        ...resume,
        languages: [...resume.languages, value],
      });

      setLanguage("");
    }
  };

  const removeLanguage = (index) => {
    setResume({
      ...resume,
      languages: resume.languages.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold mb-2">
        Languages
      </h2>

      <p className="text-sm text-gray-500 mb-5">
        Press Enter after typing a language.
      </p>

      <input
        type="text"
        placeholder="English"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        onKeyDown={addLanguage}
        className="w-full border rounded-lg px-4 py-3"
      />

      <div className="flex flex-wrap gap-2 mt-5">
        {resume.languages.map((lang, index) => (
          <span
            key={index}
            className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {lang}

            <button
              onClick={() => removeLanguage(index)}
              className="font-bold hover:text-red-600"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}