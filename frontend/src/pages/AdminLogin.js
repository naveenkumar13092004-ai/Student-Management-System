import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Admin login
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validate fields
    if (!formData.email.trim() || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    // Get backend API URL
    const API_URL = process.env.REACT_APP_API_URL;

    console.log("API URL:", API_URL);

    if (!API_URL) {
      setError(
        "API URL is missing. Please check your Vercel Environment Variables."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL.replace(/\/+$/, "")}/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password
          })
        }
      );

      // Read server response
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Admin login failed. Please check your details."
        );
      }

      // Check token
      if (!data.token) {
        throw new Error(
          "Admin token was not received from the server."
        );
      }

      // Remove old Student login session
      localStorage.removeItem("studentToken");
      localStorage.removeItem("student");

      // Save Admin login details
      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin || {})
      );

      // Navigate to Admin Dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error("Admin Login Error:", err);

      if (err instanceof TypeError) {
        setError(
          "Unable to connect to the backend. Please check your API URL and backend server."
        );
      } else {
        setError(err.message || "Something went wrong.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        {/* Login Header */}
        <div className="login-header">
          <h1>Admin Login</h1>
          <p>Welcome back! Please login to your account.</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-wrapper">

              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        {/* Register Link */}
        <div className="login-footer">
          <p>
            Don't have an admin account?{" "}
            <Link to="/admin-register">
              Register here
            </Link>
          </p>
        </div>

      </div>

    </div>
  );
}

export default AdminLogin;