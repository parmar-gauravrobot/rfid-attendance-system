// // import { useNavigate } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import { setAuthToken } from "../api/client";

// // const Navbar = () => {
// //   const navigate = useNavigate();
// //   const { auth, logout } = useAuth();

// //   const handleLogout = () => {
// //     logout();
// //     setAuthToken(null);
// //     navigate("/login");
// //   };

// //   return (
// //     <header className="topbar">
// //       <div className="topbar-inner">
// //         <strong>RFID Attendance Management</strong>
// //         <div>
// //           <span style={{ marginRight: 10 }}>{auth?.user?.name}</span>
// //           <span className="badge" style={{ marginRight: 10 }}>
// //             {auth?.user?.role}
// //           </span>
// //           <button onClick={handleLogout}>Logout</button>
// //         </div>
// //       </div>
// //     </header>
// //   );
// // };

// // export default Navbar;

// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { setAuthToken } from "../api/client";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { auth, logout } = useAuth();

//   const handleLogout = () => {
//     logout();
//     setAuthToken(null);
//     navigate("/login");
//   };

//   return (
//     <header className="topbar">
//       <div className="topbar-inner">

//         {/* LEFT */}
//         <div className="topbar-left">
//           <h2>RFID Attendance</h2>
//           <p>Welcome back 👋</p>
//         </div>

//         {/* RIGHT */}
//         <div className="topbar-right">

//           {/* USER INFO */}
//           <div className="user-info">
//             <div className="avatar">
//               {auth?.user?.name?.charAt(0).toUpperCase()}
//             </div>

//             <div className="user-text">
//               <span className="username">{auth?.user?.name}</span>
//               <span className="role">{auth?.user?.role}</span>
//             </div>
//           </div>

//           {/* LOGOUT */}
//           <button className="logout-btn" onClick={handleLogout}>
//             Logout
//           </button>

//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;