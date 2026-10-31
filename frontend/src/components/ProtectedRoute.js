
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const isStudent = role === "student";

  const token = localStorage.getItem(
    isStudent ? "studentToken" : "token"
  );

  const user = JSON.parse(
    localStorage.getItem(
      isStudent ? "student" : "admin"
    ) || "null"
  );

  if (!token || !user) {
    return (
      <Navigate
        to={isStudent ? "/student-login" : "/admin-login"}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
