import React from "react";

export default function CertificationForm({ resume, setResume }) {

  const addCertification = () => {
    setResume({
      ...resume,
      certifications: [
        ...resume.certifications,
        {
          title: "",
          organization: "",
          year: "",
        },
      ],
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...resume.certifications];
    updated[index][field] = value;

    setResume({
      ...resume,
      certifications: updated,
    });
  };

  const removeCertification = (index) => {
    setResume({
      ...resume,
      certifications: resume.certifications.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Certifications
        </h2>

        <button
          onClick={addCertification}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Add
        </button>

      </div>

      {resume.certifications.length === 0 && (
        <p className="text-gray-500">
          No certifications added.
        </p>
      )}

      {resume.certifications.map((cert, index) => (
        <div
          key={index}
          className="border rounded-lg p-5 mb-5 bg-gray-50 space-y-4"
        >

          <div className="flex justify-between">

            <h3 className="font-semibold">
              Certification #{index + 1}
            </h3>

            <button
              onClick={() => removeCertification(index)}
              className="text-red-600"
            >
              Remove
            </button>

          </div>

          <input
            placeholder="Certification Name"
            value={cert.title}
            onChange={(e) =>
              updateCertification(index, "title", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Organization"
            value={cert.organization}
            onChange={(e) =>
              updateCertification(index, "organization", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

          <input
            placeholder="Year"
            value={cert.year}
            onChange={(e) =>
              updateCertification(index, "year", e.target.value)
            }
            className="w-full border rounded-lg px-4 py-3"
          />

        </div>
      ))}
    </div>
  );
}