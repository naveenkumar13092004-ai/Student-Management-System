
import React, { useEffect, useState } from "react";
import apiRequest from "../services/api";

function StudentForm({ onStudentAdded }) {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    phone: "",
    course: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    apiRequest("/courses", {}, token)
      .then(data => setCourses(data.data || []))
      .catch(() => setCourses([]));
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiRequest("/students/register", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm({
        name: "",
        email: "",
        password: "",
        studentId: "",
        phone: "",
        course: ""
      });

      onStudentAdded();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="student-form-panel">
      <h2>Add New Student</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Student Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label>Student ID</label>
        <input
          name="studentId"
          value={form.studentId}
          onChange={handleChange}
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <label>Course</label>
        <select
          name="course"
          value={form.course}
          onChange={handleChange}
        >
          <option value="">Select course</option>

          {courses.map(course => (
            <option key={course._id} value={course._id}>
              {course.name}
            </option>
          ))}
        </select>

        <button type="submit">Add Student</button>
      </form>
    </section>
  );
}

export default StudentForm;
