
const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin
} = require("../controllers/adminController");

// ADMIN REGISTER
router.post("/register", registerAdmin);

// ADMIN LOGIN
router.post("/login", loginAdmin);

// Keep your existing protected course routes below this line.

module.exports = router;
