
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./StudentCourses.css";

function StudentCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/courses/public"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load courses."
          );
        }

        const courseList = Array.isArray(data)
          ? data
          : data.courses || data.data || [];

        setCourses(courseList);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  return (
    <div className="student-courses-container">

      {/* NAVBAR */}
      <Navbar />

      <main className="student-courses-content">

        {/* PAGE HEADER */}
        <div className="student-courses-header">
          <div>
            <p className="student-courses-eyebrow">
              STUDENT PORTAL
            </p>

            <h1>Available Courses</h1>

            <p className="student-courses-subtitle">
              Explore available courses and course fees
            </p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="course-error">
            {error}
          </div>
        )}

        {/* COURSE TABLE CARD */}
        <section className="student-courses-card">

          <div className="student-courses-card-heading">
            <div>
              <h2>All Courses</h2>
              <p>View your available academic courses</p>
            </div>

            <span className="course-count">
              {courses.length} Courses
            </span>
          </div>

          {loading ? (
            <div className="course-loading">
              Loading courses...
            </div>
          ) : (
            <div className="student-course-table-wrapper">

              <table className="student-course-table">

                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Course Name</th>
                    <th>Course Code</th>
                    <th>Description</th>
                    <th>Duration</th>
                    <th>Fees (₹)</th>
                  </tr>
                </thead>

                <tbody>
                  {courses.length > 0 ? (
                    courses.map((course, index) => (
                      <tr key={course._id || index}>
                        <td>{index + 1}</td>

                        <td className="course-name">
                          {course.name || "—"}
                        </td>

                        <td>
                          {course.code || "—"}
                        </td>

                        <td>
                          {course.description || "—"}
                        </td>

                        <td>
                          {course.duration || "—"}
                        </td>

                        <td className="course-fees">
                          ₹
                          {Number(
                            course.fees || 0
                          ).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="no-courses">
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>

            </div>
          )}

        </section>

        {/* BACK TO DASHBOARD BUTTON - PAGE BOTTOM */}
        <div className="back-dashboard-container">
          <button
            type="button"
            className="back-dashboard-btn"
            onClick={() => navigate("/student-dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

      </main>
    </div>
  );
}

export default StudentCourses;
