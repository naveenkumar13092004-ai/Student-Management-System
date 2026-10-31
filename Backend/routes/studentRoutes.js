
const express = require("express");
const router = express.Router();

const {
  registerStudent,
  loginStudent,
  getStudents,
  getStudentProfile,
  updateStudentProfile,
  deleteStudent,
} = require("../controllers/studentController");

const verifyToken = require("../middleware/verifytoken");

// Student registration and login
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Student profile
router.get("/profile", verifyToken, getStudentProfile);
router.put("/profile", verifyToken, updateStudentProfile);

// Admin student management
router.get("/", verifyToken, getStudents);
router.delete("/:id", verifyToken, deleteStudent);

module.exports = router;
