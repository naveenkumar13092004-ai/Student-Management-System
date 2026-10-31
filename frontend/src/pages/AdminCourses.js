
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./AdminCourses.css";

const API_URL = "http://localhost:5000/courses";

function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
    duration: "",
    fees: ""
  });

  const token = localStorage.getItem("token");

  // Get all courses
  const getCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load courses.");
      }

      const courseList = Array.isArray(data)
        ? data
        : Array.isArray(data.courses)
        ? data.courses
        : Array.isArray(data.data)
        ? data.data
        : [];

      setCourses(courseList);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getCourses();
  }, [getCourses]);

  // Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Open add form
  const handleAdd = () => {
    setEditingId(null);

    setForm({
      name: "",
      code: "",
      description: "",
      duration: "",
      fees: ""
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  };

  // Open edit form
  const handleEdit = (course) => {
    setEditingId(course._id);

    setForm({
      name: course.name || "",
      code: course.code || "",
      description: course.description || "",
      duration: course.duration || "",
      fees: course.fees ?? ""
    });

    setError("");
    setSuccess("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Add or update course
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name.trim() ||
      !form.code.trim() ||
      !form.duration.trim() ||
      form.fees === ""
    ) {
      setError("Please fill in all required course fields.");
      return;
    }

    if (Number(form.fees) < 0) {
      setError("Course fees cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API_URL}/${editingId}`
        : API_URL;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name.trim(),
          code: form.code.trim(),
          description: form.description.trim(),
          duration: form.duration.trim(),
          fees: Number(form.fees)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to save course.");
      }

      setSuccess(
        editingId
          ? "Course updated successfully!"
          : "Course added successfully!"
      );

      setShowForm(false);
      setEditingId(null);

      setForm({
        name: "",
        code: "",
        description: "",
        duration: "",
        fees: ""
      });

      await getCourses();

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete course.");
      }

      setCourses((previous) =>
        previous.filter((course) => course._id !== id)
      );

      setSuccess("Course deleted successfully!");

    } catch (err) {
      setError(err.message);
    }
  };

  // Search courses
  const filteredCourses = courses.filter((course) => {
    const searchValue = search.toLowerCase();

    return (
      String(course.name || "").toLowerCase().includes(searchValue) ||
      String(course.code || "").toLowerCase().includes(searchValue) ||
      String(course.description || "").toLowerCase().includes(searchValue) ||
      String(course.duration || "").toLowerCase().includes(searchValue)
    );
  });

  return (
    <div className="admin-courses-container">

      <Navbar />

      <main className="admin-courses-content">

        {/* PAGE HEADER */}

        <div className="admin-courses-header">

          <div>
            <p className="admin-courses-eyebrow">
              ADMINISTRATION
            </p>

            <h1>Course Management</h1>

            <p className="admin-courses-subtitle">
              Manage all academic courses in your system.
            </p>
          </div>

          <button
            type="button"
            className="add-course-btn"
            onClick={handleAdd}
          >
            + Add New Course
          </button>

        </div>

        {/* SUCCESS AND ERROR */}

        {error && (
          <div className="course-message course-error">
            {error}
          </div>
        )}

        {success && (
          <div className="course-message course-success">
            {success}
          </div>
        )}

        {/* COURSE STATISTICS */}

        <div className="admin-course-stats">

          <div className="admin-course-stat-card">

            <div className="admin-course-stat-icon">
              📊
            </div>

            <div>
              <p>Total Courses</p>
              <h2>{courses.length}</h2>
            </div>

          </div>

          <div className="admin-course-stat-card">

            <div className="admin-course-stat-icon">
              🔍
            </div>

            <div>
              <p>Search Results</p>
              <h2>{filteredCourses.length}</h2>
            </div>

          </div>

        </div>

        {/* ADD / EDIT COURSE FORM */}

        {showForm && (

          <section className="admin-course-form-card">

            <div className="admin-course-form-heading">

              <div>
                <h2>
                  {editingId ? "Edit Course" : "Add New Course"}
                </h2>

                <p>Enter your course information below.</p>
              </div>

              <button
                type="button"
                className="course-form-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>

            </div>

            <form
              className="admin-course-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-course-form-grid">

                <div className="admin-course-form-group">
                  <label>Course Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter course name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-course-form-group">
                  <label>Course Code *</label>
                  <input
                    type="text"
                    name="code"
                    placeholder="Example: MERN101"
                    value={form.code}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-course-form-group">
                  <label>Duration *</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="Example: 6 Month"
                    value={form.duration}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="admin-course-form-group">
                  <label>Course Fees (₹) *</label>
                  <input
                    type="number"
                    name="fees"
                    placeholder="Enter course fees"
                    value={form.fees}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="admin-course-form-group course-full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter course description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                  />
                </div>

              </div>

              <div className="admin-course-form-actions">

                <button
                  type="button"
                  className="course-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="course-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Course"
                    : "Save Course"}
                </button>

              </div>

            </form>

          </section>

        )}

        {/* ALL COURSES TABLE */}

        <section className="admin-courses-table-card">

          <div className="admin-courses-table-heading">

            <div>
              <h2>All Courses</h2>
              <p>View, edit and delete your courses.</p>
            </div>

            <input
              type="text"
              className="admin-course-search"
              placeholder="Search courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          {loading ? (

            <div className="course-loading">
              Loading courses...
            </div>

          ) : (

            <div className="admin-courses-table-wrapper">

              <table className="admin-courses-table">

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Fees</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredCourses.length > 0 ? (

                    filteredCourses.map((course, index) => (

                      <tr key={course._id || index}>

                        <td>{index + 1}</td>

                        <td className="admin-course-name">
                          {course.name || "—"}
                        </td>

                        <td>
                          <span className="course-code-badge">
                            {course.code || "—"}
                          </span>
                        </td>

                        <td>{course.description || "—"}</td>

                        <td>{course.duration || "—"}</td>

                        <td className="admin-course-fees">
                          ₹{Number(course.fees || 0).toLocaleString("en-IN")}
                        </td>

                        <td>
                          <div className="admin-course-actions">

                            <button
                              type="button"
                              className="admin-course-edit-btn"
                              onClick={() => handleEdit(course)}
                            >
                              ➜ Edit
                            </button>

                            <button
                              type="button"
                              className="admin-course-delete-btn"
                              onClick={() => handleDelete(course._id)}
                            >
                              ▯ Delete
                            </button>

                          </div>
                        </td>

                      </tr>

                    ))

                  ) : (

                    <tr>
                      <td colSpan="7" className="no-courses">
                        No courses found.
                      </td>
                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* CENTERED BACK TO DASHBOARD BUTTON */}

        <div className="courses-bottom-navigation">

          <button
            type="button"
            className="courses-back-dashboard-btn"
            onClick={() => navigate("/dashboard")}
          >
            ← Back to Dashboard
          </button>

        </div>

      </main>

    </div>
  );
}

export default Courses;
