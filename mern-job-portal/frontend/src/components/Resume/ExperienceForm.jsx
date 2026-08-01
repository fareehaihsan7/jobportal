import React from "react";

export default function ExperienceForm({ resume, setResume }) {
  const addExperience = () => {
    setResume({
      ...resume,
      experience: [
        ...resume.experience,
        {
          company: "",
          jobTitle: "",
          location: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: "",
        },
      ],
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...resume.experience];
    updated[index][field] = value;

    setResume({
      ...resume,
      experience: updated,
    });
  };

  const removeExperience = (index) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Work Experience
        </h2>

        <button
          onClick={addExperience}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>
      </div>

      {resume.experience.length === 0 && (
        <p className="text-gray-500">
          No experience added yet.
        </p>
      )}

      {resume.experience.map((exp, index) => (
        <div
          key={index}
          className="border rounded-lg p-5 mb-5 bg-gray-50 space-y-4"
        >
          <div className="flex justify-between">
            <h3 className="font-semibold">
              Experience #{index + 1}
            </h3>

            <button
              onClick={() => removeExperience(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <input
            placeholder="Company Name"
            value={exp.company}
            onChange={(e) =>
              updateExperience(index, "company", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Job Title"
            value={exp.jobTitle}
            onChange={(e) =>
              updateExperience(index, "jobTitle", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Location"
            value={exp.location}
            onChange={(e) =>
              updateExperience(index, "location", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="month"
              value={exp.startDate}
              onChange={(e) =>
                updateExperience(index, "startDate", e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            />

            <input
              type="month"
              disabled={exp.currentlyWorking}
              value={exp.endDate}
              onChange={(e) =>
                updateExperience(index, "endDate", e.target.value)
              }
              className="border rounded-lg px-4 py-3"
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={exp.currentlyWorking}
              onChange={(e) =>
                updateExperience(
                  index,
                  "currentlyWorking",
                  e.target.checked
                )
              }
            />

            I currently work here
          </label>

          <textarea
            rows={5}
            placeholder="Describe your responsibilities and achievements..."
            value={exp.description}
            onChange={(e) =>
              updateExperience(index, "description", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 resize-none"
          />
        </div>
      ))}
    </div>
  );
}