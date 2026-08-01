import User from "../models/User.js";

// =========================================
// Get Logged-in User Resume
// =========================================
export const getMyResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("resumeBuilder");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      resume: user.resumeBuilder || {},
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================
// Create Resume
// =========================================
export const createResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.resumeBuilder = req.body;

    await user.save();

    res.status(201).json({
      success: true,
      message: "Resume saved successfully.",
      resume: user.resumeBuilder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================
// Update Resume
// =========================================
export const updateResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.resumeBuilder = req.body;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume updated successfully.",
      resume: user.resumeBuilder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// =========================================
// Delete Resume
// =========================================
export const deleteResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    user.resumeBuilder = {};

    await user.save();

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
// =========================================
// Upload Generated Resume PDF
// =========================================
export const uploadResumePdf = async (req, res) => {
  try {
    console.log("UPLOAD FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required.",
      });
    }
     console.log("UPLOAD FILE:", req.file);

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }


    user.resumeUrl = req.file.path;
    user.resumeOriginalName = req.file.originalname;


    await user.save();


    console.log(
      "SAVED RESUME URL:",
      user.resumeUrl
    );


    res.status(200).json({
      success: true,
      message: "Resume PDF uploaded successfully.",
      resumeUrl: user.resumeUrl,
      userId: user._id,
    });


  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "PDF upload failed.",
      error: error.message,
    });
  }
};