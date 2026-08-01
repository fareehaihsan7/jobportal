import React from "react";

export default function EducationForm({ resume, setResume }) {
  const addEducation = () => {
    setResume({
      ...resume,
      education: [
        ...resume.education,
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateEducation = (index, field, value) => {
    const updated = [...resume.education];
    updated[index][field] = value;

    setResume({
      ...resume,
      education: updated,
    });
  };

  const removeEducation = (index) => {
    setResume({
      ...resume,
      education: resume.education.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Education
        </h2>

        <button
          onClick={addEducation}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>
      </div>

      {resume.education.length === 0 && (
        <p className="text-gray-500">
          No education added yet.
        </p>
      )}

      {resume.education.map((edu, index) => (
        <div
          key={index}
          className="border rounded-lg p-5 mb-5 space-y-4 bg-gray-50"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">
              Education #{index + 1}
            </h3>

            <button
              onClick={() => removeEducation(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <input
            placeholder="Institution"
            value={edu.institution}
            onChange={(e) =>
              updateEducation(index, "institution", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Degree"
            value={edu.degree}
            onChange={(e) =>
              updateEducation(index, "degree", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Field of Study"
            value={edu.fieldOfStudy}
            onChange={(e) =>
              updateEducation(index, "fieldOfStudy", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              placeholder="Start Date"
              value={edu.startDate}
              onChange={(e) =>
                updateEducation(index, "startDate", e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            />

            <input
              placeholder="End Date"
              value={edu.endDate}
              onChange={(e) =>
                updateEducation(index, "endDate", e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            />
          </div>

          <textarea
            rows={4}
            placeholder="Description"
            value={edu.description}
            onChange={(e) =>
              updateEducation(index, "description", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 resize-none"
          />
        </div>
      ))}
    </div>
  );
}