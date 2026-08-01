import React from "react";

export default function ResumePreview({ resume }) {
  // const { personalInfo } = resume;
  const personalInfo = resume.personalInfo || {};

  return (
    <div className="sticky top-6">
      <div
        id="resume-preview"
        className="bg-white shadow-xl rounded-xl p-10 min-h-[1100px]"
      >
        {/* Header */}

        <div className="text-center border-b-2 border-gray-300 pb-6">

          <h1 className="text-4xl font-bold text-gray-900">
            {personalInfo.fullName || "Your Name"}
          </h1>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-sm text-gray-600">

            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}

            {personalInfo.phone && (
              <span>{personalInfo.phone}</span>
            )}

            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}

          </div>

          <div className="mt-2 flex flex-wrap justify-center gap-4 text-blue-600 text-sm">

            {personalInfo.linkedin && (
              <span>{personalInfo.linkedin}</span>
            )}

            {personalInfo.github && (
              <span>{personalInfo.github}</span>
            )}

            {personalInfo.portfolio && (
              <span>{personalInfo.portfolio}</span>
            )}

          </div>

        </div>

        {/* Summary */}

        {resume.summary && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-3">
              Professional Summary
            </h2>

            <p className="text-gray-700 leading-7 whitespace-pre-wrap">
              {resume.summary}
            </p>

          </section>
        )}

        {/* Skills */}

        {resume.skills.length > 0 && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-4">
              Skills
            </h2>

            <div className="flex flex-wrap gap-2">

              {resume.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}

            </div>

          </section>
        )}

        {/* Education */}

        {resume.education.length > 0 && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-4">
              Education
            </h2>

            {resume.education.map((edu, index) => (

              <div key={index} className="mb-5">

                <div className="flex justify-between">

                  <h3 className="font-semibold">
                    {edu.degree}
                  </h3>

                  <span className="text-gray-500">
                    {edu.startDate} - {edu.endDate}
                  </span>

                </div>

                <p className="text-gray-700">
                  {edu.institution}
                </p>

                <p className="text-gray-600 mt-2">
                  {edu.description}
                </p>

              </div>

            ))}

          </section>
        )}

        {/* Experience */}

        {resume.experience.length > 0 && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-4">
              Work Experience
            </h2>

            {resume.experience.map((exp, index) => (

              <div key={index} className="mb-6">

                <div className="flex justify-between">

                  <h3 className="font-semibold">
                    {exp.jobTitle}
                  </h3>

                  <span className="text-gray-500">

                    {exp.startDate} -

                    {exp.currentlyWorking
                      ? " Present"
                      : ` ${exp.endDate}`}

                  </span>

                </div>

                <p className="font-medium">
                  {exp.company}
                </p>

                <p className="text-sm text-gray-500">
                  {exp.location}
                </p>

                <p className="mt-2 whitespace-pre-wrap">
                  {exp.description}
                </p>

              </div>

            ))}

          </section>
        )}

        {/* Projects */}

        {resume.projects.length > 0 && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-4">
              Projects
            </h2>

            {resume.projects.map((project, index) => (

              <div key={index} className="mb-6">

                <h3 className="font-semibold">
                  {project.title}
                </h3>

                <p className="text-blue-600 text-sm">
                  {project.technologies}
                </p>

                <p className="mt-2">
                  {project.description}
                </p>

              </div>

            ))}

          </section>
        )}

        {/* Certifications */}

        {resume.certifications.length > 0 && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-4">
              Certifications
            </h2>

            {resume.certifications.map((cert, index) => (

              <div key={index} className="mb-3">

                <h3 className="font-semibold">
                  {cert.title}
                </h3>

                <p className="text-gray-600">
                  {cert.organization}
                </p>

                <p className="text-sm text-gray-500">
                  {cert.year}
                </p>

              </div>

            ))}

          </section>
        )}

        {/* Languages */}

        {resume.languages.length > 0 && (
          <section className="mt-8">

            <h2 className="text-xl font-bold border-b pb-2 mb-4">
              Languages
            </h2>

            <div className="flex flex-wrap gap-2">

              {resume.languages.map((language, index) => (

                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                >
                  {language}
                </span>

              ))}

            </div>

          </section>
        )}
      </div>
    </div>
  );
}