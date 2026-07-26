// import Job from "../models/Job.js";
// import Application from "../models/Application.js";
// import User from "../models/User.js";

// // Public: count of open jobs per city/location, for sidebar filters
// export const getLocationCounts = async (req, res) => {
//   try {
//     const results = await Job.aggregate([
//       { $match: { status: "open" } },
//       { $group: { _id: "$location", count: { $sum: 1 } } },
//       { $sort: { count: -1 } },
//       { $limit: 12 },
//     ]);
//     const counts = {};
//     results.forEach((r) => { counts[r._id] = r.count; });
//     res.json({ counts });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch location counts", error: err.message });
//   }
// };

// // Public: count of open jobs per category, for sidebar filters
// export const getCategoryCounts = async (req, res) => {
//   try {
//     const results = await Job.aggregate([
//       { $match: { status: "open" } },
//       { $group: { _id: "$category", count: { $sum: 1 } } },
//     ]);
//     const counts = {};
//     results.forEach((r) => { counts[r._id] = r.count; });
//     res.json({ counts });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch category counts", error: err.message });
//   }
// };

// // Public: companies currently hiring, with open job counts, for the landing page slider
// export const getFeaturedCompanies = async (req, res) => {
//   try {
//     const results = await Job.aggregate([
//       { $match: { status: "open" } },
//       { $group: { _id: "$employer", openJobs: { $sum: 1 } } },
//       { $sort: { openJobs: -1 } },
//       { $limit: 10 },
//     ]);

//     const employerIds = results.map((r) => r._id);
//     const employers = await User.find({ _id: { $in: employerIds } }).select(
//       "companyName companyLogoUrl companyDescription companyWebsite"
//     );

//     const countMap = {};
//     results.forEach((r) => { countMap[r._id] = r.openJobs; });

//     const companies = employers
//       .map((e) => ({
//         _id: e._id,
//         companyName: e.companyName,
//         companyLogoUrl: e.companyLogoUrl,
//         companyDescription: e.companyDescription,
//         companyWebsite: e.companyWebsite,
//         openJobs: countMap[e._id] || 0,
//       }))
//       .sort((a, b) => b.openJobs - a.openJobs);

//     res.json({ companies });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch companies", error: err.message });
//   }
// };

// // Public: browse/search jobs with filters
// export const getJobs = async (req, res) => {
//   try {
//     const { q, category, type, remote, location, page = 1, limit = 10 } = req.query;

//     const filter = { status: "open" };
//     if (q) filter.$text = { $search: q };
//     if (category) filter.category = category;
//     if (type) filter.type = type;
//     if (remote === "true") filter.remote = true;
//     if (location) filter.location = { $regex: location, $options: "i" };

//     const skip = (Number(page) - 1) * Number(limit);

//     const [jobs, total] = await Promise.all([
//       Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
//       Job.countDocuments(filter),
//     ]);

//     res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
//   }
// };

// export const getJobById = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id).populate("employer", "name companyName companyWebsite");
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     res.json({ job });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch job", error: err.message });
//   }
// };

// // Employer: create a job
// export const createJob = async (req, res) => {
//   try {
//     const job = await Job.create({
//       ...req.body,
//       employer: req.user._id,
//       companyName: req.user.companyName,
//       companyLogoUrl: req.user.companyLogoUrl || "",
//     });
//     res.status(201).json({ job });
//   } catch (err) {
//     res.status(400).json({ message: "Failed to create job", error: err.message });
//   }
// };

// // Employer: update own job
// export const updateJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     if (String(job.employer) !== String(req.user._id)) {
//       return res.status(403).json({ message: "You can only edit your own job listings" });
//     }
//     Object.assign(job, req.body);
//     await job.save();
//     res.json({ job });
//   } catch (err) {
//     res.status(400).json({ message: "Failed to update job", error: err.message });
//   }
// };

// // Employer: delete own job
// export const deleteJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });
//     if (String(job.employer) !== String(req.user._id)) {
//       return res.status(403).json({ message: "You can only delete your own job listings" });
//     }
//     await job.deleteOne();
//     await Application.deleteMany({ job: job._id });
//     res.json({ message: "Job deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete job", error: err.message });
//   }
// };

// // Employer: list jobs they've posted
// export const getMyJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
//     res.json({ jobs });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
//   }
// };

// // Applicant: toggle a job as saved/unsaved
// export const toggleSaveJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) return res.status(404).json({ message: "Job not found" });

//     const user = await User.findById(req.user._id);
//     const index = user.savedJobs.findIndex((j) => String(j) === String(job._id));

//     let saved;
//     if (index === -1) {
//       user.savedJobs.push(job._id);
//       saved = true;
//     } else {
//       user.savedJobs.splice(index, 1);
//       saved = false;
//     }
//     await user.save();

//     res.json({ saved });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update saved jobs", error: err.message });
//   }
// };

// // Applicant: list their saved jobs
// export const getSavedJobs = async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).populate({
//       path: "savedJobs",
//       options: { sort: { createdAt: -1 } },
//     });
//     res.json({ jobs: user.savedJobs });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch saved jobs", error: err.message });
//   }
// };
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// Public: count of open jobs per city/location, for sidebar filters
export const getLocationCounts = async (req, res) => {
  try {
    const results = await Job.aggregate([
      { $match: { status: "open" } },
      {
        $group: {
          _id: { $toLower: "$location" },
          // keep one original-cased version to display, e.g. "Lahore" not "lahore"
          display: { $first: "$location" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, // alphabetical, case-insensitive since _id is already lowercased
    ]);

    const counts = {};
    results.forEach((r) => {
      counts[r.display] = r.count;
    });
    res.json({ counts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch location counts", error: err.message });
  }
};

// Public: count of open jobs per category, for sidebar filters
export const getCategoryCounts = async (req, res) => {
  try {
    const results = await Job.aggregate([
      { $match: { status: "open" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const counts = {};
    results.forEach((r) => { counts[r._id] = r.count; });
    res.json({ counts });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category counts", error: err.message });
  }
};

// Public: companies currently hiring, with open job counts, for the landing page slider
export const getFeaturedCompanies = async (req, res) => {
  try {
    const results = await Job.aggregate([
      { $match: { status: "open" } },
      { $group: { _id: "$employer", openJobs: { $sum: 1 } } },
      { $sort: { openJobs: -1 } },
      { $limit: 10 },
    ]);

    const employerIds = results.map((r) => r._id);
    const employers = await User.find({ _id: { $in: employerIds } }).select(
      "companyName companyLogoUrl companyDescription companyWebsite"
    );

    const countMap = {};
    results.forEach((r) => { countMap[r._id] = r.openJobs; });

    const companies = employers
      .map((e) => ({
        _id: e._id,
        companyName: e.companyName,
        companyLogoUrl: e.companyLogoUrl,
        companyDescription: e.companyDescription,
        companyWebsite: e.companyWebsite,
        openJobs: countMap[e._id] || 0,
      }))
      .sort((a, b) => b.openJobs - a.openJobs);

    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies", error: err.message });
  }
};

// Public: browse/search jobs with filters
export const getJobs = async (req, res) => {
  try {
    const { q, category, type, remote, location, page = 1, limit = 10 } = req.query;

    const filter = { status: "open" };
    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (remote === "true") filter.remote = true;
    if (location) filter.location = { $regex: location, $options: "i" };

    const skip = (Number(page) - 1) * Number(limit);

    const [jobs, total] = await Promise.all([
      Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Job.countDocuments(filter),
    ]);

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch jobs", error: err.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employer", "name companyName companyWebsite");
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch job", error: err.message });
  }
};

// Employer: create a job
export const createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      employer: req.user._id,
      companyName: req.user.companyName,
      companyLogoUrl: req.user.companyLogoUrl || "",
    });
    res.status(201).json({ job });
  } catch (err) {
    res.status(400).json({ message: "Failed to create job", error: err.message });
  }
};

// Employer: update own job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.employer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only edit your own job listings" });
    }
    Object.assign(job, req.body);
    await job.save();
    res.json({ job });
  } catch (err) {
    res.status(400).json({ message: "Failed to update job", error: err.message });
  }
};

// Employer: delete own job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (String(job.employer) !== String(req.user._id)) {
      return res.status(403).json({ message: "You can only delete your own job listings" });
    }
    await job.deleteOne();
    await Application.deleteMany({ job: job._id });
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete job", error: err.message });
  }
};

// Employer: list jobs they've posted
export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch your jobs", error: err.message });
  }
};

// Applicant: toggle a job as saved/unsaved
export const toggleSaveJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const user = await User.findById(req.user._id);
    const index = user.savedJobs.findIndex((j) => String(j) === String(job._id));

    let saved;
    if (index === -1) {
      user.savedJobs.push(job._id);
      saved = true;
    } else {
      user.savedJobs.splice(index, 1);
      saved = false;
    }
    await user.save();

    res.json({ saved });
  } catch (err) {
    res.status(500).json({ message: "Failed to update saved jobs", error: err.message });
  }
};

// Applicant: list their saved jobs
export const getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "savedJobs",
      options: { sort: { createdAt: -1 } },
    });
    res.json({ jobs: user.savedJobs });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch saved jobs", error: err.message });
  }
};