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
// router.post("/me/logo", protect, requireRole("employer"), uploadLogo.single("logo"), uploadCompanyLogo);
// router.post(
//   "/me/profile-picture",
//   protect,
//   uploadProfilePicture.single("profilePicture"),
//   uploadEmployerProfilePicture
// );
router.post(
  "/me/logo",
  protect,
  requireRole("employer"),
  (req, res, next) => {
    uploadLogo.single("logo")(req, res, (err) => {
      if (err) {
        console.error("Logo Upload Error:", err);

        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      console.log("Logo req.file =", req.file);
      next();
    });
  },
  uploadCompanyLogo
);
router.post(
  "/me/profile-picture",
  protect,
  (req, res, next) => {
    uploadProfilePicture.single("profilePicture")(req, res, (err) => {
      if (err) {
        console.error("Upload Error:", err);
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      console.log("req.file =", req.file);
      next();
    });
  },
  uploadEmployerProfilePicture
);
export default router;
