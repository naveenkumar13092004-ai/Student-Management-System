const Student = require("../models/Student");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function: Get course name and code
const getCourseDetails = async (courseId) => {
  try {
    if (!courseId) {
      return {
        courseName: "Not assigned",
        courseCode: "",
      };
    }

    // Find course using its MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(courseId)) {
      const course = await Course.findById(courseId)
        .select("name code")
        .lean();

      if (course) {
        return {
          courseName: course.name,
          courseCode: course.code,
        };
      }
    }

    // Support older records where course is plain text
    return {
      courseName: String(courseId),
      courseCode: "",
    };
  } catch (error) {
    console.error("Get Course Details Error:", error);

    return {
      courseName: "Not assigned",
      courseCode: "",
    };
  }
};

// ======================================
// STUDENT REGISTRATION
// ======================================
const registerStudent = async (req, res) => {
  try {
    const {
      Id,
      name,
      email,
      phone,
      age,
      gender,
      course,
      password,
      address,
    } = req.body;

    if (!Id || !name || !email || !phone || !age || !course || !password) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const studentId = Id.trim().toUpperCase();
    const studentEmail = email.trim().toLowerCase();

    // Check duplicate student ID
    const existingId = await Student.findOne({ Id: studentId });

    if (existingId) {
      return res.status(400).json({
        message: "Student ID already exists.",
      });
    }

    // Check duplicate email
    const existingEmail = await Student.findOne({
      email: studentEmail,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists.",
      });
    }

    // Check whether selected course exists
    const selectedCourse = await Course.findById(course);

    if (!selectedCourse) {
      return res.status(400).json({
        message: "Selected course does not exist.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await Student.create({
      Id: studentId,
      name: name.trim(),
      email: studentEmail,
      phone,
      age,
      gender: gender || "",
      course: selectedCourse._id.toString(),
      password: hashedPassword,
      address: address || "",
    });

    return res.status(201).json({
      message: "Student registered successfully.",
      student: {
        _id: student._id,
        Id: student.Id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        gender: student.gender,
        course: student.course,
        courseName: selectedCourse.name,
        courseCode: selectedCourse.code,
        address: student.address,
      },
    });
  } catch (error) {
    console.error("Student Registration Error:", error);

    return res.status(500).json({
      message: "Unable to register student.",
      error: error.message,
    });
  }
};

// ======================================
// STUDENT LOGIN
// ======================================
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password.",
      });
    }

    const student = await Student.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
        role: "student",
      },
      process.env.SECRETKEY,
      {
        expiresIn: "1d",
      }
    );

    const courseDetails = await getCourseDetails(student.course);

    return res.status(200).json({
      message: "Login successful.",
      token,
      student: {
        _id: student._id,
        Id: student.Id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        age: student.age,
        gender: student.gender,
        course: student.course,
        courseName: courseDetails.courseName,
        courseCode: courseDetails.courseCode,
        address: student.address,
      },
    });
  } catch (error) {
    console.error("Student Login Error:", error);

    return res.status(500).json({
      message: "Unable to login.",
    });
  }
};

// ======================================
// GET ALL STUDENTS - ADMIN
// ======================================
const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // Collect valid course IDs
    const courseIds = students
      .map((student) => student.course)
      .filter(
        (id) =>
          id &&
          mongoose.Types.ObjectId.isValid(id)
      );

    // Fetch all matching courses
    const courses = await Course.find({
      _id: {
        $in: courseIds,
      },
    })
      .select("name code")
      .lean();

    // Create course lookup map
    const courseMap = {};

    courses.forEach((course) => {
      courseMap[course._id.toString()] = course;
    });

    // Add course name and code to every student
    const updatedStudents = students.map((student) => {
      const courseId = student.course
        ? String(student.course)
        : "";

      const matchedCourse = courseMap[courseId];

      return {
        ...student,

        courseName: matchedCourse
          ? matchedCourse.name
          : (
              courseId &&
              !mongoose.Types.ObjectId.isValid(courseId)
                ? courseId
                : "Not assigned"
            ),

        courseCode: matchedCourse
          ? matchedCourse.code
          : "",
      };
    });

    return res.status(200).json({
      data: updatedStudents,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      message: "Unable to fetch students.",
    });
  }
};

// ======================================
// GET STUDENT PROFILE
// ======================================
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const courseDetails = await getCourseDetails(
      student.course
    );

    return res.status(200).json({
      student: {
        ...student.toObject(),
        courseName: courseDetails.courseName,
        courseCode: courseDetails.courseCode,
      },
    });
  } catch (error) {
    console.error("Get Student Profile Error:", error);

    return res.status(500).json({
      message: "Unable to fetch student profile.",
    });
  }
};

// ======================================
// UPDATE STUDENT PROFILE
// ======================================
const updateStudentProfile = async (req, res) => {
  try {
    const {
      name,
      phone,
      age,
      gender,
      course,
      address,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = age;
    if (gender !== undefined) updateData.gender = gender;
    if (address !== undefined) updateData.address = address;

    // Only update course if a valid course ID is supplied
    if (course !== undefined) {
      const selectedCourse = await Course.findById(course);

      if (!selectedCourse) {
        return res.status(400).json({
          message: "Selected course does not exist.",
        });
      }

      updateData.course = selectedCourse._id.toString();
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    const courseDetails = await getCourseDetails(
      student.course
    );

    return res.status(200).json({
      message: "Profile updated successfully.",
      student: {
        ...student.toObject(),
        courseName: courseDetails.courseName,
        courseCode: courseDetails.courseCode,
      },
    });
  } catch (error) {
    console.error("Update Student Profile Error:", error);

    return res.status(500).json({
      message: "Unable to update student profile.",
    });
  }
};

// ======================================
// DELETE STUDENT
// ======================================
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    return res.status(500).json({
      message: "Unable to delete student.",
    });
  }
};

// ======================================
// EXPORT CONTROLLERS
// ======================================
module.exports = {
  registerStudent,
  loginStudent,
  getStudents,
  getStudentProfile,
  updateStudentProfile,
  deleteStudent,
};
