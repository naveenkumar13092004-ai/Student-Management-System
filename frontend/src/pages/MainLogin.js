
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainLogin.css";

function MainLogin() {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Change between Admin and Student login
  const handleLoginType = (type) => {
    setLoginType(type);
    setEmail("");
    setPassword("");
    setError("");
    setShowPassword(false);
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const apiUrl =
      loginType === "admin"
        ? "http://localhost:5000/admin/login"
        : "http://localhost:5000/students/login";

    try {
      setLoading(true);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token) {
        throw new Error("Login token was not received.");
      }

      // ADMIN LOGIN
      if (loginType === "admin") {
        localStorage.removeItem("studentToken");
        localStorage.removeItem("student");

        localStorage.setItem("token", data.token);
        localStorage.setItem(
          "admin",
          JSON.stringify(data.admin || {})
        );

        navigate("/dashboard", { replace: true });
      }

      // STUDENT LOGIN
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        localStorage.setItem("studentToken", data.token);
        localStorage.setItem(
          "student",
          JSON.stringify(data.student || {})
        );

        navigate("/student-dashboard", { replace: true });
      }

    } catch (err) {
      setError(err.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  // Register button
  const handleRegister = () => {
    if (loginType === "admin") {
      navigate("/admin-register");
    } else {
      navigate("/student-register");
    }
  };

  return (
    <div
      className="main-login-container"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(49, 30, 135, 0.48),
            rgba(49, 30, 135, 0.48)
          ),
          url("${process.env.PUBLIC_URL}/images/login-bg.png")
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >

      <div className="main-login-card">

        {/* LOGO */}

        <div className="main-login-header">

          <div className="main-login-logo">
            🎓
          </div>

          <h1>Student Management System</h1>

          <p>Welcome! Login to continue.</p>

        </div>

        {/* ADMIN AND STUDENT BUTTONS */}

        <div className="login-type-selection">

          <button
            type="button"
            className={
              loginType === "admin"
                ? "login-type-btn active"
                : "login-type-btn"
            }
            onClick={() => handleLoginType("admin")}
          >
            👨‍💼 Admin Login
          </button>

          <button
            type="button"
            className={
              loginType === "student"
                ? "login-type-btn active"
                : "login-type-btn"
            }
            onClick={() => handleLoginType("student")}
          >
            🎓 Student Login
          </button>

        </div>

        {/* LOGIN HEADING */}

        <div className="main-login-form-heading">

          <h2>
            {loginType === "admin"
              ? "Admin Login"
              : "Student Login"}
          </h2>

          <p>
            {loginType === "admin"
              ? "Login to manage students and courses."
              : "Login to access your student account."}
          </p>

        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <div className="main-login-error">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}

        <form onSubmit={handleLogin}>

          {/* EMAIL */}

          <div className="main-login-field">

            <label htmlFor="login-email">
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="main-login-field">

            <label htmlFor="login-password">
              Password
            </label>

            <div className="main-password-wrapper">

              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="main-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>

          </div>

          {/* LOGIN BUTTON */}

          <button
            type="submit"
            className="main-login-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : loginType === "admin"
              ? "Login as Admin →"
              : "Login as Student →"}
          </button>

        </form>

        {/* REGISTER LINK */}

        <div className="main-login-register">

          {loginType === "admin" ? (
            <p>
              New Admin?{" "}
              <button
                type="button"
                onClick={handleRegister}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Don't have a student account?{" "}
              <button
                type="button"
                onClick={handleRegister}
              >
                Register here
              </button>
            </p>
          )}

        </div>

      </div>

    </div>
  );
}

export default MainLogin;
