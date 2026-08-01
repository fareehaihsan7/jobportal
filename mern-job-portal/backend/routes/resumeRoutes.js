import express from "express";

import {
  createResume,
  getMyResume,
  updateResume,
  deleteResume,
  uploadResumePdf,
} from "../controllers/resumeController.js";

import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";

const router = express.Router();

// =========================================
// Get Logged-in User Resume
// =========================================
router.get(
  "/",
  protect,
  requireRole("applicant"),
  getMyResume
);


// =========================================
// Create Resume Data
// =========================================
router.post(
  "/",
  protect,
  requireRole("applicant"),
  createResume
);


// =========================================
// Update Resume Data
// =========================================
router.put(
  "/",
  protect,
  requireRole("applicant"),
  updateResume
);


// =========================================
// Delete Resume
// =========================================
router.delete(
  "/",
  protect,
  requireRole("applicant"),
  deleteResume
);


// =========================================
// Upload Generated Resume PDF to Cloudinary
// =========================================
router.post(
  "/upload-pdf",
  protect,
  requireRole("applicant"),
  uploadResume.single("resume"),
  uploadResumePdf
);


export default router;