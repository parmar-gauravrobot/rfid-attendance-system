import { NavLink, Outlet } from "react-router-dom";
import FacultyNavbar from "./navbar/FacultyNavbar";
const FacultyLayout = () => {
  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">RFID</h2>

        <nav>
          <NavLink to="/faculty/dashboard">📊 Dashboard</NavLink>
          <NavLink to="/faculty/students">👥 Students</NavLink>
          <NavLink to="/faculty/attendance">📅 Attendance</NavLink>
          <NavLink to="/faculty/analytics">📈 Analytics</NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
      <FacultyNavbar />
        <Outlet />
      </div>

    </div>
  );
};

export default FacultyLayout;