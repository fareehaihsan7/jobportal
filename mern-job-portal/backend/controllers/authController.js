// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// const signToken = (id) =>
//   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role, companyName } = req.body;

//     if (!name || !email || !password || !role) {
//       return res.status(400).json({ message: "Name, email, password, and role are required" });
//     }
//     if (!["applicant", "employer"].includes(role)) {
//       return res.status(400).json({ message: "Role must be 'applicant' or 'employer'" });
//     }
//     if (role === "employer" && !companyName) {
//       return res.status(400).json({ message: "Company name is required for employer accounts" });
//     }

//     const existing = await User.findOne({ email: email.toLowerCase() });
//     if (existing) {
//       return res.status(409).json({ message: "An account with that email already exists" });
//     }

//     const user = await User.create({
//       name,
//       email,
//       password,
//       role,
//       companyName: role === "employer" ? companyName : undefined,
//     });

//     const token = signToken(user._id);
//     res.status(201).json({ token, user: user.toSafeObject() });
//   } catch (err) {
//     res.status(500).json({ message: "Registration failed", error: err.message });
//   }
// };

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email and password are required" });
//     }

//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const token = signToken(user._id);
//     res.json({ token, user: user.toSafeObject() });
//   } catch (err) {
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// };

// export const getMe = async (req, res) => {
//   res.json({ user: req.user });
// };

// export const uploadProfileResume = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file was uploaded" });
//     }
//     const resumeUrl = `/uploads/resumes/${req.file.filename}`;
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { resumeUrl, resumeOriginalName: req.file.originalname },
//       { new: true }
//     ).select("-password");

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: "Resume upload failed", error: err.message });
//   }
// };

// export const uploadCompanyLogo = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file was uploaded" });
//     }
//     const companyLogoUrl = `/uploads/logos/${req.file.filename}`;
//     const user = await User.findByIdAndUpdate(
//       req.user._id,
//       { companyLogoUrl },
//       { new: true }
//     ).select("-password");

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: "Logo upload failed", error: err.message });
//   }
// };

// export const updateProfile = async (req, res) => {
//   try {
//     const allowedFields =
//       req.user.role === "employer"
//         ? ["name", "companyName", "companyWebsite", "companyDescription"]
//         : ["name", "headline", "phone", "location", "resumeUrl", "skills"];

//     const updates = {};
//     for (const field of allowedFields) {
//       if (req.body[field] !== undefined) updates[field] = req.body[field];
//     }

//     const user = await User.findByIdAndUpdate(req.user._id, updates, {
//       new: true,
//       runValidators: true,
//     }).select("-password");

//     res.json({ user });
//   } catch (err) {
//     res.status(500).json({ message: "Profile update failed", error: err.message });
//   }
// };
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

export const register = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password, and role are required",
      });
    }

    if (!["applicant", "employer"].includes(role)) {
      return res.status(400).json({
        message: "Role must be 'applicant' or 'employer'",
      });
    }

    if (role === "employer" && !companyName) {
      return res.status(400).json({
        message: "Company name is required for employer accounts",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(409).json({
        message: "An account with that email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      companyName: role === "employer" ? companyName : "",
    });

    const token = signToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = signToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      token,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

export const getMe = async (req, res) => {
  res.json({
    user: req.user,
  });
};

export const uploadProfileResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file was uploaded",
      });
    }

    const resumeUrl = `/uploads/resumes/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        resumeUrl,
        resumeOriginalName: req.file.originalname,
      },
      {
        new: true,
      }
    ).select("-password");

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Resume upload failed",
      error: err.message,
    });
  }
};

export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file was uploaded",
      });
    }

    const companyLogoUrl = `/uploads/logos/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        companyLogoUrl,
      },
      {
        new: true,
      }
    ).select("-password");

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Logo upload failed",
      error: err.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields =
      req.user.role === "employer"
        ? [
            "name",
            "companyName",
            "companyWebsite",
            "companyDescription",
          ]
        : [
            "name",
            "headline",
            "phone",
            "location",
            "resumeUrl",
            "skills",
          ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.json({
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Profile update failed",
      error: err.message,
    });
  }
};