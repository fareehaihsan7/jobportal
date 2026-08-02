import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import html2pdf from "html2pdf.js";

import PersonalInfoForm from "../components/Resume/PersonalInfoForm";
import SummaryForm from "../components/Resume/SummaryForm";
import SkillsForm from "../components/Resume/SkillsForm";
import EducationForm from "../components/Resume/EducationForm";
import ExperienceForm from "../components/Resume/ExperienceForm";
import ProjectsForm from "../components/Resume/ProjectsForm";
import LanguagesForm from "../components/Resume/LanguagesForm";
import CertificationForm from "../components/Resume/CertificationForm";
import ResumePreview from "../components/Resume/ResumePreview";

import downloadResume from "../utils/downloadResume";

export default function ResumeBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [resume, setResume] = useState({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
    },

    summary: "",

    education: [],

    experience: [],

    projects: [],

    skills: [],

    languages: [],

    certifications: [],
  });


  useEffect(() => {
    fetchResume();
  }, []);


  // 
  const fetchResume = async () => {
  try {
    const { data } = await api.get("/resume");

    if (
      data.resume &&
      Object.keys(data.resume).length > 0
    ) {
      setResume((prev) => ({
        ...prev,
        ...data.resume,
        personalInfo: {
          ...prev.personalInfo,
          ...(data.resume.personalInfo || {}),
        },
      }));
    }

  } catch (err) {
    console.log("No existing resume found");
  } finally {
    setLoading(false);
  }
};


  const saveResume = async () => {
    try {
      setSaving(true);


      // ==============================
      // 1. Save Resume Builder Data
      // ==============================

      try {
        await api.post("/resume", resume);

      } catch (error) {
        await api.put("/resume", resume);
      }



      // ==============================
      // 2. Generate PDF
      // ==============================

      const element = document.getElementById(
        "resume-preview"
      );


      const options = {
        margin: 0.4,

        filename: "Resume.pdf",

        image: {
          type: "jpeg",
          quality: 1,
        },

        html2canvas: {
          scale: 2,
          useCORS: true,
        },

        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };


      const pdfBlob = await html2pdf()
        .set(options)
        .from(element)
        .outputPdf("blob");



      // ==============================
      // 3. Upload PDF to Cloudinary
      // ==============================

      const formData = new FormData();

      formData.append(
        "resume",
        pdfBlob,
        "Resume.pdf"
      );


      await api.post(
        "/resume/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );


      toast.success(
        "Resume saved successfully"
      );


    } catch (error) {

      console.error(
        "Resume save error:",
        error
      );

      toast.error(
        "Unable to save resume"
      );


    } finally {

      setSaving(false);

    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg font-semibold">
        Loading Resume Builder...
      </div>
    );
  }



  return (
    <div className="bg-slate-100 min-h-screen py-10">

      <div className="max-w-7xl mx-auto px-6">


        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">


          <div>

            <h1 className="text-4xl font-bold">
              Resume Builder
            </h1>


            <p className="text-gray-500 mt-2">
              Create a professional resume in minutes.
            </p>


          </div>



          <div className="flex gap-3">


            <button
              onClick={saveResume}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition"
            >

              {saving
                ? "Saving..."
                : "Save Resume"}

            </button>



            <button
              onClick={downloadResume}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >

              Download PDF

            </button>


          </div>


        </div>



        {/* Main Layout */}


        <div className="grid lg:grid-cols-2 gap-8">



          {/* Forms */}


          <div className="space-y-6">


            <PersonalInfoForm
              resume={resume}
              setResume={setResume}
            />


            <SummaryForm
              resume={resume}
              setResume={setResume}
            />


            <SkillsForm
              resume={resume}
              setResume={setResume}
            />


            <EducationForm
              resume={resume}
              setResume={setResume}
            />


            <ExperienceForm
              resume={resume}
              setResume={setResume}
            />


            <ProjectsForm
              resume={resume}
              setResume={setResume}
            />


            <LanguagesForm
              resume={resume}
              setResume={setResume}
            />


            <CertificationForm
              resume={resume}
              setResume={setResume}
            />


          </div>




          {/* Preview */}


          <ResumePreview
            resume={resume}
          />



        </div>


      </div>


    </div>
  );
}