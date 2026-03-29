import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { setAuthToken } from "../../api/client";
import { FiLogOut, FiKey, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const { auth, logout } = useAuth();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const user = auth?.user;

  // 🔥 LOGOUT
  const handleLogout = () => {
    toast.success("Logged out successfully 👋");

    setTimeout(() => {
      logout();
      setAuthToken(null);
      navigate("/login");
    }, 700);
  };

  // 🔥 INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 PASSWORD UPDATE
  const handlePasswordUpdate = () => {
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      return toast.error("All fields are required");
    }

    if (form.newPassword !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (form.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    // 👉 API CALL HERE

    toast.success("Password updated successfully 🔐");

    setShowPasswordModal(false);

    // 🔥 reset form after update
    setForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <div className="student-navbar">

        {/* LEFT */}
        <h2 className="nav-title">Student Dashboard</h2>

        {/* RIGHT */}
        <div className="nav-right">

          {/* CHANGE PASSWORD */}
          <button
            className="nav-btn"
            onClick={() => setShowPasswordModal(true)}
          >
            <FiKey /> Change Password
          </button>

          {/* LOGOUT */}
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>

          {/* AVATAR */}
          <div
            className="student-avatar"
            onClick={() => setShowProfileModal(true)}
            title="View Profile"
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>

        </div>
      </div>

      {/* 🔥 PROFILE MODAL */}
      {showProfileModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()} // prevent close on inside click
          >

            <button
              className="close-btn"
              onClick={() => setShowProfileModal(false)}
            >
              <FiX />
            </button>

            {/* 🔥 AVATAR INSIDE MODAL */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
              <div className="student-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <h3>Student Profile</h3>

            <label>Name</label>
            <input value={user?.name || ""} disabled />

            <label>Roll Number</label>
            <input value={user?.rollNumber || ""} disabled />

            <label>RFID UID</label>
            <input value={user?.rfid_uid || user?.rfidUid || ""} disabled />

            <label>Email</label>
            <input value={user?.email || ""} disabled />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowProfileModal(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔥 PASSWORD MODAL */}
      {showPasswordModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="close-btn"
              onClick={() => setShowPasswordModal(false)}
            >
              <FiX />
            </button>

            <h3>Change Password</h3>

            <label>Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={handleChange}
            />

            <label>New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={handlePasswordUpdate}
              >
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default StudentNavbar;