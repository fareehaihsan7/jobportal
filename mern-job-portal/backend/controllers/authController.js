
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Job from "../models/Job.js";
import { OAuth2Client } from "google-auth-library";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
      authProvider: "local",
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

if (user.authProvider === "google") {
  return res.status(400).json({
    message:
      "This account uses Google Sign-In. Please continue with Google.",
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
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({
      email: payload.email.toLowerCase(),
    });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: "",
        role: "applicant",
        authProvider: "google",
        googleId: payload.sub,
        profilePicture: payload.picture,
      });
    } else if (user.authProvider === "local") {
      return res.status(400).json({
        message:
          "This email is already registered with a password. Please sign in using your password.",
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
      message: "Google login failed",
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

    // Cloudinary file URL
    const resumeUrl = req.file.path;

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

    console.log("Resume URL:", resumeUrl);

    res.json({
      success: true,
      resumeUrl,
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
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

    // Cloudinary URL
    const companyLogoUrl = req.file.path;

    // Update employer profile
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        companyLogoUrl,
      },
      {
        new: true,
      }
    ).select("-password");

    // Update all jobs posted by this employer
    await Job.updateMany(
      { employer: req.user._id },
      {
        companyLogoUrl,
        companyName: user.companyName,
      }
    );

    console.log("Company Logo URL:", companyLogoUrl);

    res.json({
      success: true,
      companyLogoUrl,
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Logo upload failed",
      error: err.message,
    });
  }
};


export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const {
      name,
      companyName,
      phone,
      designation,
      location,
      bio,
      headline,
      skills,
    } = req.body;

    // Common Fields
    if (name !== undefined) user.name = name;
    if (headline !== undefined) user.headline = headline;
    if (companyName !== undefined) user.companyName = companyName;

    if (phone !== undefined) user.phone = phone;
    if (designation !== undefined) user.designation = designation;
    if (location !== undefined) user.location = location;
    if (bio !== undefined) user.bio = bio;

    // Skills
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: user.toSafeObject ? user.toSafeObject() : user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};
export const uploadEmployerProfilePicture = async (req, res) => {
  try {
     console.log("req.file =", req.file);


    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

     //user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully.",
      profilePicture: user.profilePicture,
      user: user.toSafeObject ? user.toSafeObject() : user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to upload profile picture.",
    });
  }
};