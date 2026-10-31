import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Students.css";

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get all students
  const getStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/students",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch students");
      }

      setStudents(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Get Students Error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // Delete student
  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/students/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete student");
      }

      setStudents((previousStudents) =>
        previousStudents.filter((student) => student._id !== id)
      );

      if (selectedStudent?._id === id) {
        setSelectedStudent(null);
      }

      alert("Student deleted successfully!");
    } catch (err) {
      console.error("Delete Student Error:", err);
      alert(err.message || "Unable to delete student.");
    }
  };

  // Search students
  const filteredStudents = students.filter((student) => {
    const searchText = search.toLowerCase();

    return (
      (student.Id || "").toLowerCase().includes(searchText) ||
      (student.name || "").toLowerCase().includes(searchText) ||
      (student.email || "").toLowerCase().includes(searchText) ||
      (student.phone || "").toLowerCase().includes(searchText) ||
      (student.courseName || "").toLowerCase().includes(searchText)
    );
  });

  return (
    <div className="students-page">

      {/* Page Header */}
      <div className="students-header">
        <div>
          <p className="section-eyebrow">ADMIN MANAGEMENT</p>

          <h1>Students Management</h1>

          <p>View and manage all registered students.</p>
        </div>

        <div className="total-students-card">
          <span>Total Students</span>
          <h2>{students.length}</h2>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-table-card">

        <div className="students-table-header">
          <div>
            <h2>All Students</h2>
            <p>Registered student information</p>
          </div>

          <input
            className="students-search"
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <p>Loading students...</p>
        ) : (
          <div className="table-responsive">
            <table className="students-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Course</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>

                      <td className="student-id">
                        {student.Id || "-"}
                      </td>

                      <td>
                        {student.name || "-"}
                      </td>

                      <td>
                        {student.email || "-"}
                      </td>

                      <td>
                        {student.phone || "-"}
                      </td>

                      <td>
                        {student.courseName || "Not assigned"}
                      </td>

                      <td>
                        <div className="student-actions">

                          <button
                            className="view-button"
                            onClick={() =>
                              setSelectedStudent(student)
                            }
                          >
                            View Details
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              deleteStudent(student._id)
                            }
                          >
                            Delete
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>

      {/* Student Details Popup */}
      {selectedStudent && (
        <div
          className="student-modal-overlay"
          onClick={() => setSelectedStudent(null)}
        >
          <div
            className="student-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="student-modal-header">
              <h2>Student Details</h2>

              <button
                className="close-button"
                onClick={() => setSelectedStudent(null)}
              >
                ×
              </button>
            </div>

            <div className="student-details">

              <p>
                <strong>Student ID</strong>
                <span>{selectedStudent.Id || "-"}</span>
              </p>

              <p>
                <strong>Student Name</strong>
                <span>{selectedStudent.name || "-"}</span>
              </p>

              <p>
                <strong>Email</strong>
                <span>{selectedStudent.email || "-"}</span>
              </p>

              <p>
                <strong>Phone</strong>
                <span>{selectedStudent.phone || "-"}</span>
              </p>

              <p>
                <strong>Age</strong>
                <span>{selectedStudent.age || "-"}</span>
              </p>

              <p>
                <strong>Gender</strong>
                <span>{selectedStudent.gender || "-"}</span>
              </p>

              <p>
                <strong>Course</strong>
                <span>
                  {selectedStudent.courseName || "Not assigned"}
                </span>
              </p>

              <p>
                <strong>Course Code</strong>
                <span>{selectedStudent.courseCode || "-"}</span>
              </p>

              <p>
                <strong>Address</strong>
                <span>{selectedStudent.address || "-"}</span>
              </p>

            </div>

            <div className="student-modal-actions">
              <button
                className="view-button"
                onClick={() => setSelectedStudent(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="students-page-navigation">

        <button
          className="back-dashboard-button"
          onClick={() => navigate("/dashboard")}
        >
          ← Back Dashboard
        </button>

        <button
          className="next-course-button"
          onClick={() => navigate("/courses")}
        >
          Next Course →
        </button>

      </div>

    </div>
  );
}

export default Students;
