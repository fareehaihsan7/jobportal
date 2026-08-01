import React from "react";

export default function ProjectsForm({ resume, setResume }) {
  const addProject = () => {
    setResume({
      ...resume,
      projects: [
        ...resume.projects,
        {
          title: "",
          technologies: "",
          github: "",
          liveDemo: "",
          description: "",
        },
      ],
    });
  };

  const updateProject = (index, field, value) => {
    const updated = [...resume.projects];
    updated[index][field] = value;

    setResume({
      ...resume,
      projects: updated,
    });
  };

  const removeProject = (index) => {
    setResume({
      ...resume,
      projects: resume.projects.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Projects
        </h2>

        <button
          onClick={addProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add
        </button>
      </div>

      {resume.projects.length === 0 && (
        <p className="text-gray-500">
          No projects added yet.
        </p>
      )}

      {resume.projects.map((project, index) => (
        <div
          key={index}
          className="border rounded-lg p-5 mb-5 bg-gray-50 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">
              Project #{index + 1}
            </h3>

            <button
              onClick={() => removeProject(index)}
              className="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <input
            placeholder="Project Title"
            value={project.title}
            onChange={(e) =>
              updateProject(index, "title", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Technologies (React, Node.js, MongoDB...)"
            value={project.technologies}
            onChange={(e) =>
              updateProject(index, "technologies", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="GitHub Repository URL"
            value={project.github}
            onChange={(e) =>
              updateProject(index, "github", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Live Demo URL"
            value={project.liveDemo}
            onChange={(e) =>
              updateProject(index, "liveDemo", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <textarea
            rows={4}
            placeholder="Describe your project..."
            value={project.description}
            onChange={(e) =>
              updateProject(index, "description", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3 resize-none"
          />
        </div>
      ))}
    </div>
  );
}