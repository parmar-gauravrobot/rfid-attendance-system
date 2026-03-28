import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import Dashboard from "./pages/faculty/Dashboard";
import Students from "./pages/faculty/Students";
import Attendance from "./pages/faculty/Attendance";
import Analytics from "./pages/faculty/Analytics";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import { setAuthToken } from "./api/client";
import FacultyLayout from "./components/FacultyLayout";

function App() {
  const { auth } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
    }
  }, []);

  return (
    <Routes>

      {/* LOGIN */}
      <Route path="/login" element={<LoginPage />} />

      {/* STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      {/* FACULTY PARENT */}
      <Route path="/faculty" element={
  <ProtectedRoute role="faculty">
    <FacultyLayout />
  </ProtectedRoute>
}>
  <Route index element={<Navigate to="dashboard" />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="students" element={<Students />} />
  <Route path="attendance" element={<Attendance />} />
  <Route path="analytics" element={<Analytics />} />
</Route>

      {/* GLOBAL REDIRECT */}
      <Route
        path="*"
        element={
          <Navigate
            to={
              auth?.user?.role === "faculty"
                ? "/faculty/dashboard"
                : auth?.user?.role === "student"
                ? "/student"
                : "/login"
            }
          />
        }
      />

    </Routes>
  );
}

export default App;