import express from "express";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";

const router = express.Router();

router.post("/job/:jobId", protect, requireRole("applicant"), uploadResume.single("resume"), applyToJob);
router.get("/mine", protect, requireRole("applicant"), getMyApplications);
router.get("/job/:jobId", protect, requireRole("employer"), getApplicationsForJob);
router.put("/:id/status", protect, requireRole("employer"), updateApplicationStatus);

export default router;
