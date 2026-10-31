
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Dashboard.css";

const API_URL = "http://localhost:5000";

function Dashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const admin = JSON.parse(
    localStorage.getItem("admin") || "{}"
  );

  // HANDLE DIFFERENT BACKEND RESPONSE FORMATS
  const getList = (data, key) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.[key])) return data.data[key];

    return [];
  };

  // FETCH STUDENTS AND COURSES
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please log in again. Authentication token not found."
          );
        }

        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        const [studentResponse, courseResponse] =
          await Promise.all([
            fetch(`${API_URL}/students`, { headers }),
            fetch(`${API_URL}/courses`, { headers }),
          ]);

        const studentData = await studentResponse.json();
        const courseData = await courseResponse.json();

        if (!studentResponse.ok) {
          throw new Error(
            studentData.message || "Unable to load students"
          );
        }

        if (!courseResponse.ok) {
          throw new Error(
            courseData.message || "Unable to load courses"
          );
        }

        const studentList = getList(studentData, "students");
        const courseList = getList(courseData, "courses");

        setStudents(studentList);
        setCourses(courseList);

      } catch (err) {
        setError(err.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // DATE
  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // GET COURSE NAME
  const getCourseName = (course) => {
    if (!course) {
      return "Not assigned";
    }

    // If course is an object
    if (typeof course === "object") {
      return course.name || "Not assigned";
    }

    // If course is a MongoDB ObjectId
    const foundCourse = courses.find(
      (item) => String(item._id) === String(course)
    );

    if (foundCourse) {
      return foundCourse.name;
    }

    // If course is already stored as text
    return course;
  };

  // RECENT STUDENTS
  const recentStudents = [...students]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  return (
    <div className="dashboard-layout">

      {/* NAVBAR */}
      <Navbar />

      <main className="dashboard-page">

        {/* DASHBOARD HEADING */}
        <section className="dashboard-heading">
          <div>
            <p className="dashboard-breadcrumb">
              Workspace / Overview
            </p>

            <h1>Dashboard</h1>

            <p className="dashboard-subtitle">
              Welcome back, {admin.name || "Admin"}!
              {" "}Here is your student management overview.
            </p>
          </div>

          <div className="dashboard-date">
            <div className="dashboard-date-icon">
              📅
            </div>

            <div>
              <strong>{currentDate}</strong>
              <span>Today's date</span>
            </div>
          </div>
        </section>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="dashboard-error">
            {error}
          </div>
        )}

        {/* WELCOME BANNER */}
        <section className="dashboard-welcome">
          <div>
            <span className="dashboard-welcome-label">
              YOUR ACADEMIC WORKSPACE
            </span>

            <h2>Everything in one place.</h2>

            <p>
              Manage student records and courses from your dashboard.
            </p>

            <Link
              to="/students"
              className="dashboard-primary-button"
            >
              Manage students <span>→</span>
            </Link>
          </div>

          <div className="dashboard-welcome-art">
            <div className="welcome-art-circle"></div>

            <div className="welcome-art-card">
              <span>✦</span>
              <strong>Learn</strong>
              <strong>Grow</strong>
              <small>Achieve more</small>
            </div>
          </div>
        </section>

        {/* STATISTICS CARDS */}
        <section className="dashboard-stats">

          {/* STUDENTS */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-icon student-stat-icon">
                ♙
              </div>

              <span className="dashboard-stat-label">
                STUDENTS
              </span>
            </div>

            <h2>
              {loading ? "..." : students.length}
            </h2>

            <p>Total registered students</p>
          </div>

          {/* COURSES */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-icon course-stat-icon">
                ▤
              </div>

              <span className="dashboard-stat-label">
                COURSES
              </span>
            </div>

            <h2>
              {loading ? "..." : courses.length}
            </h2>

            <p>Total available courses</p>
          </div>

          {/* ACCOUNT */}
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-top">
              <div className="dashboard-stat-icon account-stat-icon">
                ✓
              </div>

              <span className="dashboard-stat-label">
                ACCOUNT
              </span>
            </div>

            <h2 className="dashboard-account-status">
              Active
            </h2>

            <p>Administrator session</p>
          </div>

        </section>

        {/* RECENT STUDENTS */}
        <section className="dashboard-recent">

          <div className="dashboard-recent-heading">
            <div>
              <h2>Recent Students</h2>
              <p>Latest student records in your system</p>
            </div>

            <Link
              to="/students"
              className="dashboard-view-all"
            >
              View all students →
            </Link>
          </div>

          <div className="dashboard-table-scroll">
            <table className="dashboard-table">

              <thead>
                <tr>
                  <th>STUDENT</th>
                  <th>STUDENT ID</th>
                  <th>EMAIL</th>
                  <th>COURSE</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="dashboard-table-empty"
                    >
                      Loading students...
                    </td>
                  </tr>
                ) : recentStudents.length > 0 ? (
                  recentStudents.map((student) => (
                    <tr key={student._id}>

                      {/* STUDENT NAME */}
                      <td>
                        <div className="dashboard-student-name">
                          <div className="dashboard-student-avatar">
                            {student.name
                              ? student.name.charAt(0).toUpperCase()
                              : "S"}
                          </div>

                          <strong>
                            {student.name || "Student"}
                          </strong>
                        </div>
                      </td>

                      {/* STUDENT ID */}
                      <td>
                        {student.Id ||
                          student.studentId ||
                          "Not assigned"}
                      </td>

                      {/* EMAIL */}
                      <td>
                        {student.email || "—"}
                      </td>

                      {/* COURSE */}
                      <td>
                        <span className="dashboard-course-badge">
                          {getCourseName(student.course)}
                        </span>
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="dashboard-table-empty"
                    >
                      No students registered yet.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="dashboard-footer">
          © {new Date().getFullYear()} Student Management System.
          All rights reserved.
        </footer>

      </main>
    </div>
  );
}

export default Dashboard;
