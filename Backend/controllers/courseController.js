
const Course = require("../models/Course");

// GET ALL COURSES - PUBLIC
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ name: 1 });

    return res.status(200).json({
      success: true,
      courses: courses
    });
  } catch (error) {
    console.error("Get courses error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load courses."
    });
  }
};

// CREATE COURSE - ADMIN
const createCourse = async (req, res) => {
  try {
    const { name, code, description, duration, fees } = req.body;

    if (!name || !code || !duration || fees === undefined || fees === "") {
      return res.status(400).json({
        success: false,
        message: "Please enter all required course details."
      });
    }

    const existingCourse = await Course.findOne({
      $or: [
        { name: name.trim() },
        { code: code.trim() }
      ]
    });

    if (existingCourse) {
      return res.status(400).json({
        success: false,
        message: "Course name or code already exists."
      });
    }

    const course = await Course.create({
      name: name.trim(),
      code: code.trim(),
      description: description || "",
      duration,
      fees: Number(fees)
    });

    return res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course
    });
  } catch (error) {
    console.error("Create course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create course."
    });
  }
};

// UPDATE COURSE - ADMIN
const updateCourse = async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.fees !== undefined) {
      updates.fees = Number(updates.fees);
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      course
    });
  } catch (error) {
    console.error("Update course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update course."
    });
  }
};

// DELETE COURSE - ADMIN
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully."
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete course."
    });
  }
};

module.exports = {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
};
