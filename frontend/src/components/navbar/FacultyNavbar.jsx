import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../api/client";

const FacultyNavbar = ({ onRefresh }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setAuthToken(null);
    navigate("/login");
  };

  const getTitle = () => {
    if (location.pathname.includes("students")) return "Students";
    if (location.pathname.includes("attendance")) return "Attendance";
    if (location.pathname.includes("analytics")) return "Analytics";
    return "Dashboard";
  };

  return (
    <div className="admin-navbar">

      {/* LEFT */}
      <h2>{getTitle()}</h2>

      {/* RIGHT */}
      <div className="nav-actions">

        {/* 🔄 REFRESH */}
        <button className="icon-btn" onClick={onRefresh}>
          🔄
        </button>

        {/* ➕ ADD STUDENT (ONLY ON DASHBOARD) */}
        {location.pathname.includes("dashboard") && (
          <button
            className="primary-btn"
            onClick={() => navigate("/faculty/students")}
          >
            + Add Student
          </button>
        )}

        {/* USER */}
        <div className="user">
          👤 {auth?.user?.name}
        </div>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
};

export default FacultyNavbar;

// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import { setAuthToken } from "../../api/client";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { auth, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     setAuthToken(null);
//     navigate("/login");
//   };

//   // 🔥 dynamic title
//   const getTitle = () => {
//     if (location.pathname.includes("students")) return "Students";
//     if (location.pathname.includes("attendance")) return "Attendance";
//     if (location.pathname.includes("analytics")) return "Analytics";
//     return "Dashboard";
//   };

//   return (
//     <div className="admin-navbar">

//       {/* LEFT: PAGE TITLE */}
//       <h2>{getTitle()}</h2>

//       {/* RIGHT: USER + ACTIONS */}
//       <div className="nav-actions">

//         <button className="refresh-btn">🔄</button>

//         <div className="user">
//           👤 {auth?.user?.name}
//         </div>

//         <button className="logout-btn" onClick={handleLogout}>
//           Logout
//         </button>

//       </div>
//     </div>
//   );
// };

// export default Navbar;