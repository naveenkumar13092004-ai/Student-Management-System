import React from "react";
import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Main Login Page
import MainLogin from "./pages/MainLogin";

// Admin Pages
import AdminRegister from "./pages/AdminRegister";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Courses from "./pages/AdminCourses";

// Student Pages
import StudentRegister from "./pages/StudentRegister";
import StudentDashboard from "./pages/Studentdashboard";
import StudentCourses from "./pages/StudentCourses";

// ==================================
// ADMIN ROUTE PROTECTION
// ==================================
const AdminRoute = ({ children }) => {
  const adminToken = localStorage.getItem("token");

  if (!adminToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ==================================
// STUDENT ROUTE PROTECTION
// ==================================
const StudentRoute = ({ children }) => {
  const adminToken = localStorage.getItem("token");
  const studentToken = localStorage.getItem("studentToken");

  // Prevent admin from opening student pages
  if (adminToken) {
    return <Navigate to="/dashboard" replace />;
  }

  // Student must be logged in
  if (!studentToken) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ==================================
// MAIN APP
// ==================================
function App() {
  return (
    <Routes>

      {/* MAIN LOGIN */}
      <Route path="/" element={<MainLogin />} />
      <Route path="/login" element={<MainLogin />} />
      <Route path="/student-login" element={<MainLogin />} />

      {/* ADMIN REGISTER */}
      <Route
        path="/admin-register"
        element={<AdminRegister />}
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />

      {/* ADMIN STUDENTS */}
      <Route
        path="/students"
        element={
          <AdminRoute>
            <Students />
          </AdminRoute>
        }
      />

      {/* ADMIN COURSES */}
      <Route
        path="/courses"
        element={
          <AdminRoute>
            <Courses />
          </AdminRoute>
        }
      />

      {/* STUDENT REGISTER */}
      <Route
        path="/student-register"
        element={<StudentRegister />}
      />

      {/* STUDENT DASHBOARD */}
      <Route
        path="/student-dashboard"
        element={
          <StudentRoute>
            <StudentDashboard />
          </StudentRoute>
        }
      />

      {/* STUDENT COURSES */}
      <Route
        path="/student-courses"
        element={
          <StudentRoute>
            <StudentCourses />
          </StudentRoute>
        }
      />

      {/* INVALID URL */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;
