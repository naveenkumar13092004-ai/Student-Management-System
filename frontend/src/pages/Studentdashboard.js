
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  // Get student details from localStorage
  const [student, setStudent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("student")) || {};
    } catch {
      return {};
    }
  });

  const [showProfile, setShowProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile form data
  const [form, setForm] = useState({
    name: student.name || "",
    email: student.email || "",
    phone: student.phone || "",
    age: student.age || "",
    gender: student.gender || "",
    course: student.course || "",
    address: student.address || "",
  });

  // Check login and fetch latest student profile
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const token = localStorage.getItem("studentToken");

      if (!token) {
        navigate("/student-login");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/students/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load student profile"
          );
        }

        if (data.student) {
          setStudent(data.student);

          localStorage.setItem(
            "student",
            JSON.stringify(data.student)
          );
        }
      } catch (err) {
        console.error("Profile loading error:", err);
        setError(err.message || "Unable to load profile");
      }
    };

    fetchStudentProfile();
  }, [navigate]);

  // Update form when student details change
  useEffect(() => {
    setForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      age: student.age || "",
      gender: student.gender || "",
      course: student.course || "",
      address: student.address || "",
    });
  }, [student]);

  // Hide success message after 1 second
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 1000);

    return () => clearTimeout(timer);
  }, [message]);

  // Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Open profile popup
  const openProfile = () => {
    setError("");
    setMessage("");
    setIsEditing(false);
    setShowProfile(true);
  };

  // Close profile popup
  const closeProfile = () => {
    setShowProfile(false);
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("student");
    navigate("/student-login");
  };

  // Cancel editing
  const handleCancel = () => {
    setForm({
      name: student.name || "",
      email: student.email || "",
      phone: student.phone || "",
      age: student.age || "",
      gender: student.gender || "",
      course: student.course || "",
      address: student.address || "",
    });

    setIsEditing(false);
    setError("");
  };

  // Save updated profile
  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("studentToken");

    if (!token) {
      navigate("/student-login");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "http://localhost:5000/students/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update profile"
        );
      }

      // Get updated student from backend
      const updatedStudent =
        data.student || data.data || data;

      // Preserve course name and Student ID
      const finalStudent = {
        ...student,
        ...updatedStudent,
        Id: updatedStudent.Id || student.Id || "",
        courseName:
          updatedStudent.courseName || student.courseName || "",
        courseCode:
          updatedStudent.courseCode || student.courseCode || "",
      };

      setStudent(finalStudent);

      localStorage.setItem(
        "student",
        JSON.stringify(finalStudent)
      );

      setIsEditing(false);
      setMessage("Profile updated successfully!");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get student's first letter
  const firstLetter = student.name
    ? student.name.charAt(0).toUpperCase()
    : "S";

  return (
    <div className="student-dashboard-container">

      <Navbar />

      <main className="student-dashboard-content">

        {/* Welcome Section */}
        <section className="welcome-card">

          <div>
            <p className="welcome-label">
              STUDENT PORTAL
            </p>

            <h1>
              Welcome, {student.name || "Student"}!
            </h1>

            <p>
              Welcome to your student dashboard.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </section>

        {/* Dashboard Cards */}
        <section className="dashboard-stats">

          {/* Courses Card */}
          <div className="stat-card">

            <div className="stat-icon">
              📚
            </div>

            <div>
              <h3>My Courses</h3>

              <p>
                View your enrolled courses
              </p>

              <button
                className="stat-link"
                onClick={() => navigate("/student-courses")}
              >
                View Courses →
              </button>
            </div>

          </div>

          {/* Profile Card */}
          <div className="stat-card">

            <div className="stat-icon">
              👤
            </div>

            <div>
              <h3>My Profile</h3>

              <p>
                View and manage your details
              </p>

              <button
                className="stat-link"
                onClick={openProfile}
              >
                View Profile →
              </button>
            </div>

          </div>

        </section>

        {/* Profile Preview Section */}
        <section className="profile-card-section">

          <div className="section-heading">

            <div>
              <p className="section-eyebrow">
                PERSONAL INFORMATION
              </p>

              <h2>My Profile</h2>
            </div>

          </div>

          <div
            className="profile-preview-card"
            onClick={openProfile}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openProfile();
              }
            }}
          >

            <div className="profile-avatar">
              {firstLetter}
            </div>

            <div className="profile-preview-info">

              <h3>
                {student.name || "Student Name"}
              </h3>

              <p>
                {student.email || "No email available"}
              </p>

              <span>
                Click to view profile details
              </span>

            </div>

            <div className="profile-arrow">
              →
            </div>

          </div>

        </section>

      </main>

      {/* Profile Popup */}
      {showProfile && (

        <div
          className="profile-modal-overlay"
          onClick={closeProfile}
        >

          <div
            className="profile-modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Popup Header */}
            <div className="profile-modal-header">

              <div>
                <p className="section-eyebrow">
                  STUDENT INFORMATION
                </p>

                <h2>
                  {isEditing ? "Edit Profile" : "My Profile"}
                </h2>
              </div>

              <button
                className="close-modal-button"
                onClick={closeProfile}
                aria-label="Close profile"
              >
                ×
              </button>

            </div>

            {/* Success Message */}
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Edit Profile Form */}
            {isEditing ? (

              <form
                className="profile-edit-form"
                onSubmit={handleUpdate}
              >

                <div className="form-grid">

                  {/* Student Name */}
                  <div className="form-group">

                    <label>Student Name</label>

                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* Email */}
                  <div className="form-group">

                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />

                  </div>

                  {/* Phone */}
                  <div className="form-group">

                    <label>Phone</label>

                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Age */}
                  <div className="form-group">

                    <label>Age</label>

                    <input
                      type="number"
                      name="age"
                      min="1"
                      max="120"
                      value={form.age}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Gender */}
                  <div className="form-group">

                    <label>Gender</label>

                    <select
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select Gender
                      </option>

                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* Course Name - Read Only */}
                  <div className="form-group">

                    <label>Course</label>

                    <input
                      type="text"
                      value={
                        student.courseName ||
                        "Course not assigned"
                      }
                      readOnly
                    />

                  </div>

                  {/* Address */}
                  <div className="form-group full-width">

                    <label>Address</label>

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows="3"
                    />

                  </div>

                </div>

                {/* Edit Buttons */}
                <div className="profile-form-actions">

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-button"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>

                </div>

              </form>

            ) : (

              /* Profile Details */
              <>

                <div className="modal-profile-heading">

                  <div className="profile-avatar large-avatar">
                    {firstLetter}
                  </div>

                  <div>

                    <h3>
                      {student.name || "Student Name"}
                    </h3>

                    <p>
                      {student.email || "No email available"}
                    </p>

                  </div>

                </div>

                <div className="profile-details-grid">

                  {/* Student ID */}
                  <div className="detail-item">

                    <span>Student ID</span>

                    <strong>
                      {student.Id || "Not assigned"}
                    </strong>

                  </div>

                  {/* Phone */}
                  <div className="detail-item">

                    <span>Phone</span>

                    <strong>
                      {student.phone || "Not available"}
                    </strong>

                  </div>

                  {/* Age */}
                  <div className="detail-item">

                    <span>Age</span>

                    <strong>
                      {student.age || "Not available"}
                    </strong>

                  </div>

                  {/* Gender */}
                  <div className="detail-item">

                    <span>Gender</span>

                    <strong>
                      {student.gender || "Not available"}
                    </strong>

                  </div>

                  {/* Course Name */}
                  <div className="detail-item">

                    <span>Course</span>

                    <strong>
                      {student.courseName || "Not available"}
                    </strong>

                  </div>

                  {/* Address */}
                  <div className="detail-item full-width">

                    <span>Address</span>

                    <strong>
                      {student.address || "Not available"}
                    </strong>

                  </div>

                </div>

                {/* Profile Buttons */}
                <div className="profile-form-actions">

                  <button
                    className="cancel-button"
                    onClick={closeProfile}
                  >
                    Close
                  </button>

                  <button
                    className="save-button"
                    onClick={() => {
                      setForm({
                        name: student.name || "",
                        email: student.email || "",
                        phone: student.phone || "",
                        age: student.age || "",
                        gender: student.gender || "",
                        course: student.course || "",
                        address: student.address || "",
                      });

                      setError("");
                      setMessage("");
                      setIsEditing(true);
                    }}
                  >
                    Edit Profile
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

export default StudentDashboard;
