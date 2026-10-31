
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./StudentRegister.css";

function StudentRegister() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    Id: "",
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    course: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  // Load available courses
  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/courses/public"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load courses");
        }

        const courseList = Array.isArray(data)
          ? data
          : data.courses || data.data || [];

        setCourses(courseList);
      } catch (err) {
        setError(err.message);
      }
    };

    getCourses();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "Id" ? value.toUpperCase() : value
    }));
  };

  // Register student
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (form.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            Id: form.Id.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            age: Number(form.age),
            gender: form.gender,
            course: form.course,
            address: form.address.trim(),
            password: form.password
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Student registration failed.");
      }

      setSuccess("Registration successful! Please login.");

      setForm({
        Id: "",
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        course: "",
        address: "",
        password: "",
        confirmPassword: ""
      });

      setTimeout(() => {
        navigate("/student-login");
      }, 1500);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="student-register-page"
      style={{
        backgroundImage: `linear-gradient(rgba(49, 31, 125, 0.48), rgba(91, 65, 190, 0.48)), url("${process.env.PUBLIC_URL}/images/login-bg.png")`
      }}
    >
      <div className="student-register-card">

        <div className="register-icon">🎓</div>

        <div className="register-heading">
          <p className="register-eyebrow">STUDENT PORTAL</p>
          <h1>Create Student Account</h1>
          <p>Enter your details to create your account.</p>
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

          <div className="register-form-grid">

            <div className="register-field">
              <label>Student ID <span>*</span></label>
              <input
                type="text"
                name="Id"
                placeholder="Example: STU001"
                value={form.Id}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Full Name <span>*</span></label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Email Address <span>*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Phone Number <span>*</span></label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Age <span>*</span></label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-field">
              <label>Gender <span>*</span></label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="register-field full-width">
              <label>Course <span>*</span></label>
              <select
                name="course"
                value={form.course}
                onChange={handleChange}
                required
              >
                <option value="">Select Course</option>

                {courses.map((course) => (
                  <option
                    key={course._id || course.name}
                    value={course._id || course.name}
                  >
                    {course.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="register-field full-width">
              <label>Address</label>
              <textarea
                name="address"
                placeholder="Enter your address"
                value={form.address}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="register-field">
              <label>Password <span>*</span></label>
              <div className="register-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={handleChange}
                  minLength="8"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="register-field">
              <label>Confirm Password <span>*</span></label>
              <div className="register-password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

          </div>

          <button
            type="submit"
            className="register-submit-btn"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register →"}
          </button>

        </form>

        <p className="register-login-link">
          Already have an account?
          <Link to="/student-login"> Login here</Link>
        </p>

      </div>
    </div>
  );
}

export default StudentRegister;
