
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files are stored on local disk under backend/uploads/resumes.
// To swap in S3 later, replace this `storage` engine with multer-s3 —
// nothing else in the app needs to change since routes only ever see
// req.file.filename / a resulting URL.
const uploadDir = path.join(__dirname, "..", "uploads", "resumes");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const unique = `${req.user._id}-${Date.now()}${ext}`;
//     cb(null, unique);
//   },
// });
// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: async (req, file) => ({
//     folder: "job-portal/resumes",
//     resource_type: "raw",
//     public_id: `${req.user._id}-${Date.now()}`,
//   }),
// });
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "job-portal/resumes",
    resource_type: "auto",
    // public_id: `${req.user._id}-${Date.now()}-${file.originalname}`,
    public_id: `${req.user._id}-${Date.now()}-${path.parse(file.originalname).name}`,
  }),
});

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error("Only PDF, DOC, or DOCX files are allowed"));
  }
  cb(null, true);
};

export const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Company logo uploads — separate folder, image types only, smaller size cap.
const logoDir = path.join(__dirname, "..", "uploads", "logos");
if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir, { recursive: true });

// const logoStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, logoDir),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, `${req.user._id}-${Date.now()}${ext}`);
//   },
// });
const logoStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "job-portal/company-logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `${req.user._id}-${Date.now()}`,
  }),
});

const LOGO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const logoFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!LOGO_EXTENSIONS.includes(ext)) {
    return cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
  }
  cb(null, true);
};

export const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: logoFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
// ======================================================
// Profile Picture Upload
// ======================================================

const profileDir = path.join(
  __dirname,
  "..",
  "uploads",
  "profile-pictures"
);

if (!fs.existsSync(profileDir)) {
  fs.mkdirSync(profileDir, { recursive: true });
}

// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, profileDir),

//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     cb(null, `${req.user._id}-${Date.now()}${ext}`);
//   },
// });
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "job-portal/profile-pictures",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: `${req.user._id}-${Date.now()}`,
  }),
});
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const profileFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!IMAGE_EXTENSIONS.includes(ext)) {
    return cb(
      new Error("Only JPG, PNG or WEBP images are allowed")
    );
  }

  cb(null, true);
};

export const uploadProfilePicture = multer({
  storage: profileStorage,
  fileFilter: profileFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});
