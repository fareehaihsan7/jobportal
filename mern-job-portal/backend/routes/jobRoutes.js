import express from "express";
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
  getCategoryCounts,
  getLocationCounts,
  getFeaturedCompanies,
  toggleSaveJob,
  getSavedJobs,
} from "../controllers/jobController.js";
import { protect, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/mine", protect, requireRole("employer"), getMyJobs);
router.get("/categories/counts", getCategoryCounts);
router.get("/locations/counts", getLocationCounts);
router.get("/companies/featured", getFeaturedCompanies);
router.get("/saved/mine", protect, requireRole("applicant"), getSavedJobs);
router.get("/:id", getJobById);
router.post("/", protect, requireRole("employer"), createJob);
router.post("/:id/save", protect, requireRole("applicant"), toggleSaveJob);
router.put("/:id", protect, requireRole("employer"), updateJob);
router.delete("/:id", protect, requireRole("employer"), deleteJob);

export default router;