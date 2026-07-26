// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },

//     password: {
//       type: String,
//       required: true,
//       minlength: 6,
//     },

//     role: {
//       type: String,
//       enum: ["applicant", "employer"],
//       required: true,
//     },

//     // Applicant-only fields

//     headline: {
//       type: String,
//       default: "",
//     },

//     phone: {
//       type: String,
//       default: "",
//     },

//     location: {
//       type: String,
//       default: "",
//     },

//     resumeUrl: {
//       type: String,
//       default: "",
//     },

//     resumeOriginalName: {
//       type: String,
//       default: "",
//     },

//     skills: [
//       {
//         type: String,
//       },
//     ],

//     // Employer-only fields

//     companyName: {
//       type: String,
//       default: "",
//     },

//     companyWebsite: {
//       type: String,
//       default: "",
//     },

//     companyDescription: {
//       type: String,
//       default: "",
//     },

//     companyLogoUrl: {
//       type: String,
//       default: "",
//     },

//     // Applicant-only: bookmarked jobs

//     savedJobs: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Job",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);

//   this.password = await bcrypt.hash(this.password, salt);

//   next();
// });

// userSchema.methods.matchPassword = function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// userSchema.methods.toSafeObject = function () {
//   const obj = this.toObject();

//   delete obj.password;

//   return obj;
// };

// export default mongoose.model("User", userSchema);
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
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
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["applicant", "employer"],
      required: true,
    },

    // Applicant-only fields

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

    resumeUrl: {
      type: String,
      default: "",
    },

    resumeOriginalName: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    // Employer-only fields

    companyName: {
      type: String,
      default: "",
    },

    companyWebsite: {
      type: String,
      default: "",
    },

    companyDescription: {
      type: String,
      default: "",
    },

    companyLogoUrl: {
      type: String,
      default: "",
    },

    // Applicant-only: Saved jobs

    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);