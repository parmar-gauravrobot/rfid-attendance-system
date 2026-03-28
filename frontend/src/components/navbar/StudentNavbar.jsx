import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../api/client";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setAuthToken(null);
    navigate("/login");
  };

  return (
    <div className="student-navbar">

      {/* LEFT */}
      <div className="nav-left">
        <h2>🎓 Student Dashboard</h2>
      </div>

      {/* RIGHT */}
      <div className="nav-right">

        <div className="student-profile">
          <div className="student-avatar">
            {auth?.user?.name?.charAt(0).toUpperCase()}
          </div>
          <span>{auth?.user?.name}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>
    </div>
  );
};

export default StudentNavbar;