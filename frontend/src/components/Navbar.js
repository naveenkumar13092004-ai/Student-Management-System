
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const studentToken = localStorage.getItem("studentToken");
  const adminToken = localStorage.getItem("token");

  // Identify the logged-in user
  const isStudent = Boolean(studentToken && !adminToken);

  const dashboardPath = isStudent
    ? "/student-dashboard"
    : "/dashboard";

  const coursesPath = isStudent
    ? "/student-courses"
    : "/courses";

  const handleLogout = () => {
    if (isStudent) {
      localStorage.removeItem("studentToken");
      localStorage.removeItem("student");
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("admin");
    }

    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">

      <div
        className="navbar-logo"
        onClick={() => navigate(dashboardPath)}
      >
        🎓 Student Management
      </div>

      <div className="navbar-links">

        <NavLink
          to={dashboardPath}
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Dashboard
        </NavLink>

        {!isStudent && (
          <NavLink
            to="/students"
            className={({ isActive }) =>
              isActive ? "navbar-link active" : "navbar-link"
            }
          >
            Students
          </NavLink>
        )}

        <NavLink
          to={coursesPath}
          className={({ isActive }) =>
            isActive ? "navbar-link active" : "navbar-link"
          }
        >
          Courses
        </NavLink>

        <button
          type="button"
          className="navbar-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default Navbar;
