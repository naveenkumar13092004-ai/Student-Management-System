
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================================
// ADMIN REGISTER
// ================================

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters"
      });
    }

    // CHECK EXISTING ADMIN
    const existingAdmin = await Admin.findOne({
      email: email.trim().toLowerCase()
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin email already exists"
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE ADMIN
    const admin = await Admin.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Admin registration error:", error);

    return res.status(500).json({
      message: error.code === 11000
        ? "Admin email already exists"
        : "Server error during admin registration"
    });
  }
};


// ================================
// ADMIN LOGIN
// ================================

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password"
      });
    }

    const admin = await Admin.findOne({
      email: email.trim().toLowerCase()
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: admin._id,
        role: "admin"
      },
      process.env.SECRETKEY,
      {
        expiresIn: "1d"
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      message: "Server error during admin login"
    });
  }
};


module.exports = {
  registerAdmin,
  loginAdmin
};
