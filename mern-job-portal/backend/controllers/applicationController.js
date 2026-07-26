import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Applicant: apply to a job
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.status !== "open") return res.status(400).json({ message: "This job is no longer accepting applications" });

    const existing = await Application.findOne({ job: job._id, applicant: req.user._id });
    if (existing) return res.status(409).json({ message: "You have already applied to this job" });

    // Prefer a freshly uploaded resume for this application; otherwise fall
    // back to whatever resume the applicant already has on their profile.
    let resumeUrl = req.user.resumeUrl || "";
    let resumeOriginalName = req.user.resumeOriginalName || "";
    if (req.file) {
      resumeUrl = `/uploads/resumes/${req.file.filename}`;
      resumeOriginalName = req.file.originalname;
    }

    if (!resumeUrl) {
      return res.status(400).json({ message: "Please attach a resume, or upload one to your profile first" });
    }

    const application = await Application.create({
      job: job._id,
      applicant: req.user._id,
      employer: job.employer,
      coverLetter: req.body.coverLetter || "",
      resumeUrl,
      resumeOriginalName,
    });

    res.status(201).json({ application });
  } catch (err) {
    res.status(400).json({ message: "Failed to submit application", error: err.message });
  }
};

// Applicant: view their own applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title companyName location type status")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// Employer: view applications for one of their jobs
export const getApplicationsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.employer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only view applicants for your own job listings" });
    }

    const applications = await Application.find({ job: job._id })
      .populate("applicant", "name email headline resumeUrl skills")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applicants", error: err.message });
  }
};

// Employer: update an application's status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["submitted", "under_review", "interview", "rejected", "hired"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });
    if (String(application.employer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only manage applications for your own job listings" });
    }

    application.status = status;
    await application.save();
    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application", error: err.message });
  }
};
