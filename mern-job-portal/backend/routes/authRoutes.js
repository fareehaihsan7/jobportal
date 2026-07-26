import express from "express";
import { register, login, getMe, updateProfile, uploadProfileResume, uploadCompanyLogo } from "../controllers/authController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume, uploadLogo } from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.post("/me/resume", protect, requireRole("applicant"), uploadResume.single("resume"), uploadProfileResume);
router.post("/me/logo", protect, requireRole("employer"), uploadLogo.single("logo"), uploadCompanyLogo);

export default router;
