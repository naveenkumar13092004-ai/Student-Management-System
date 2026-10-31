
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// DATABASE CONNECTION
// =====================================

connectDB();

// =====================================
// BACKEND TEST
// =====================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management Backend is running"
  });
});

// =====================================
// API ROUTES
// =====================================

app.use("/admin", adminRoutes);
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);

// =====================================
// UNKNOWN ROUTE
// =====================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    requestedUrl: req.originalUrl,
    method: req.method
  });
});

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

// =====================================
// START SERVER
// =====================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
