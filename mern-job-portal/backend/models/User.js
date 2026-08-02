import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ==========================
    // Basic Information
    // ==========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["applicant", "employer"],
      required: true,
    },

    // ==========================
    // Employer / Applicant Profile
    // ==========================

    profilePicture: {
      type: String,
      default: "",
    },

    headline: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    designation: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    
    resumeUrl: {
  type: String,
  default: "",
},

resumeOriginalName: {
  type: String,
  default: "",
},

// Resume Builder Data
resumeBuilder: {
  type: Object,
  default: {},
},

    skills: [
      {
        type: String,
      },
    ],

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],

    // ==========================
    // Company Profile (Employer)
    // ==========================

    companyName: {
      type: String,
      default: "",
    },

    companyLogoUrl: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    industry: {
      type: String,
      default: "",
    },

    companySize: {
      type: String,
      default: "",
    },

    foundedYear: {
      type: String,
      default: "",
    },

    headquarters: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    facebook: {
      type: String,
      default: "",
    },

    twitter: {
      type: String,
      default: "",
    },

    instagram: {
      type: String,
      default: "",
    },
  },
  
  {
    timestamps: true,
  }
  
);

export default mongoose.model("User", userSchema);