import express from "express";
import { register, login,googleLogin, getMe, updateProfile, uploadProfileResume, uploadCompanyLogo ,uploadEmployerProfilePicture} from "../controllers/authController.js";
import { protect, requireRole } from "../middleware/auth.js";
import { uploadResume, uploadLogo , uploadProfilePicture} from "../middleware/upload.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);
router.get("/me", protect, getMe);
router.put("/me", protect, updateProfile);
router.post("/me/resume", protect, requireRole("applicant"), uploadResume.single("resume"), uploadProfileResume);
router.post("/me/logo", protect, requireRole("employer"), uploadLogo.single("logo"), uploadCompanyLogo);
router.post(
  "/me/profile-picture",
  protect,
  uploadProfilePicture.single("profilePicture"),
  uploadEmployerProfilePicture
);

export default router;
