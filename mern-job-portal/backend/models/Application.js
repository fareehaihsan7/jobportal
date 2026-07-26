import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    coverLetter: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    resumeOriginalName: { type: String, default: "" },

    status: {
      type: String,
      enum: ["submitted", "under_review", "interview", "rejected", "hired"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

// One applicant can only apply once to a given job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
