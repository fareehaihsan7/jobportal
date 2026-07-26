import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    category: {
      type: String,
      required: true,
      enum: ["Engineering", "Design", "Marketing", "Sales", "Operations", "Other"],
    },
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
    },
    location: { type: String, required: true },
    remote: { type: Boolean, default: false },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    currency: { type: String, default: "PKR" },

    employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyLogoUrl: { type: String, default: "" },

    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

jobSchema.index({ title: "text", companyName: "text", description: "text" });

export default mongoose.model("Job", jobSchema);
