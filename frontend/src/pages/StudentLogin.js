import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import campusBackground from "../assets/campus-background.png";
import "./StudentLogin.css";

// Backend API URL
const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://student-management-system-hgsn.onrender.com";

function StudentLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // STUDENT LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/students/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: form.email.trim().toLowerCase(),
            password: form.password
          })
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          "Invalid server response. Please check your backend."
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Student login failed."
        );
      }

      if (!data.token || !data.student) {
        throw new Error(
          "Student login information is missing."
        );
      }

      // SAVE STUDENT DETAILS
      localStorage.setItem("studentToken", data.token);

      localStorage.setItem(
        "student",
        JSON.stringify(data.student)
      );

      // NAVIGATE TO DASHBOARD
      navigate("/student-dashboard", {
        replace: true
      });

    } catch (err) {
      console.error("Student login error:", err);

      setError(
        err.message || "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="student-auth-page"
      style={{
        backgroundImage: `url(${campusBackground})`
      }}
    >

      {/* BACKGROUND OVERLAY */}
      <div className="student-auth-overlay"></div>

      {/* LOGIN CARD */}
      <div className="student-auth-card">

        {/* HEADING */}
        <div className="student-auth-heading">

          <div className="student-auth-icon">
            🎓
          </div>

          <p className="student-auth-brand">
            STUDENT MANAGEMENT SYSTEM
          </p>

          <h1>Welcome Back!</h1>

          <p className="student-auth-subtitle">
            Student Login
          </p>

        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="student-auth-error">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div className="student-auth-input-group">

            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={handleChange}
              required
            />

          </div>

          {/* PASSWORD */}
          <div className="student-auth-input-group">

            <label>Password</label>

            <div className="student-auth-password-wrapper">

              <input
                type={
                  showPassword ? "text" : "password"
                }
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="student-auth-password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="student-auth-button"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login to Dashboard →"}
          </button>

        </form>

        {/* REGISTER LINK */}
        <div className="student-auth-footer">
          New student?{" "}
          <Link to="/student-register">
            Register here
          </Link>
        </div>

        {/* BACK HOME */}
        <Link
          to="/"
          className="student-auth-back-link"
        >
          ← Back to Home
        </Link>

      </div>

    </div>
  );
}

export default StudentLogin;