
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import campusBackground from "../assets/campus-background.png";
import "./AdminRegister.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://student-management-system-hgsn.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL.replace(/\/+$/, "")}/admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password
          })
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed."
        );
      }

      setSuccess("Admin registered successfully!");

      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/admin-login");
      }, 1200);

    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page"
      style={{
        backgroundImage: `url(${campusBackground})`
      }}
    >
      <div className="register-overlay"></div>

      <div className="register-card">

        <div className="register-heading">
          <div className="register-icon">
            🎓
          </div>

          <h1>Admin Registration</h1>

          <p>Create your administrator account</p>
        </div>

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {success && (
          <div className="register-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="register-input-group">
            <label>Admin Name</label>

            <input
              type="text"
              name="name"
              placeholder="Enter admin name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-input-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-input-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div className="register-input-group">
            <label>Confirm Password</label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>

        </form>

        <div className="register-footer">
          Already have an account?
          {" "}
          <Link to="/admin-login">
            Login here
          </Link>
        </div>

        <Link
          to="/"
          className="register-back-link"
        >
          ← Back to Home
        </Link>

      </div>
    </div>
  );
}

export default Register;
