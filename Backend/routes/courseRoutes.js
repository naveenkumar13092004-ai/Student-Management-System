
const express = require("express");
const router = express.Router();

const {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const verifyToken = require("../middleware/verifytoken");
const verifyAdmin = require("../middleware/verifyAdmin");

// Public route - students can view courses
router.get("/public", getCourses);

// Admin route - get all courses
router.get("/", verifyToken, verifyAdmin, getCourses);

// Admin route - add course
router.post("/", verifyToken, verifyAdmin, createCourse);

// Admin route - update course
router.put("/:id", verifyToken, verifyAdmin, updateCourse);

// Admin route - delete course
router.delete("/:id", verifyToken, verifyAdmin, deleteCourse);

module.exports = router;
