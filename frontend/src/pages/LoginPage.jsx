import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "../api/client";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { auth, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth?.token) {
      navigate(auth.user.role === "faculty" ? "/faculty" : "/student", { replace: true });
    }
  }, [auth, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", { email, password });
      login(data);
      localStorage.setItem("token", data.token);
      setAuthToken(data.token);
      navigate(data.user.role === "faculty" ? "/faculty" : "/student");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #1e3a8a, #2563eb)"
    }}>

      {/* LEFT SIDE */}
      <div style={{
        flex: 1,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px"
      }}>
        <h1 style={{ fontSize: "40px", marginBottom: "10px" }}>
          📡 RFID Attendance System
        </h1>
        <p style={{ fontSize: "18px", opacity: 0.9 }}>
          Smart IoT-based attendance tracking system for students and faculty.
        </p>

        <div style={{ marginTop: "30px", opacity: 0.9, lineHeight: "1.6" }}>
  <p>
    This system provides real-time attendance tracking using RFID technology,
    ensures secure authentication for both students and faculty, and offers
    an interactive analytics dashboard for monitoring attendance trends and performance.
  </p>
</div>
      </div>

      {/* RIGHT SIDE */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>

<div className="login-card">
<h2 style={{ marginBottom: "5px" }}>Welcome Back 👋</h2>
<p style={{ marginBottom: "20px", opacity: 0.8 }}>
  Login to continue
</p>

<form onSubmit={handleSubmit}>

  <div>
    <label>📧 Email</label>
    <input
      type="email"
      required
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Enter your email"
      className="login-input"
    />
  </div>

  <div>
    <label>🔒 Password</label>
    <input
      type="password"
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Enter your password"
      className="login-input"
    />
  </div>

  <button type="submit" disabled={loading} className="login-btn">
    {loading ? "Logging in..." : "Login"}
  </button>
</form>
          {/* <h2 style={{ marginBottom: "10px" }}>Login</h2> */}
          {/* <p style={{ marginBottom: "20px", opacity: 0.8 }}>
            Faculty & Student access
          </p> */}

          {/* <form onSubmit={handleSubmit}>

            <div style={{ marginBottom: "15px" }}>
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="faculty@example.com"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  marginTop: "5px"
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  marginTop: "5px"
                }}
              />
            </div>

            <button
  type="submit"
  disabled={loading}
  style={{
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.25s ease",
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)";
    e.target.style.transform = "scale(1.03)";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)";
    e.target.style.transform = "scale(1)";
  }}
  onMouseDown={(e) => {
    e.target.style.transform = "scale(0.97)";
  }}
  onMouseUp={(e) => {
    e.target.style.transform = "scale(1.03)";
  }}
>
  {loading ? "Logging in..." : "Login"}
</button>
          </form> */}

          {error && (
            <p style={{ color: "#f87171", marginTop: "10px" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api, { setAuthToken } from "../api/client";
// import { useAuth } from "../context/AuthContext";

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { auth, login } = useAuth();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (auth?.token) {
//       navigate(auth.user.role === "faculty" ? "/faculty" : "/student", { replace: true });
//     }
//   }, [auth, navigate]);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const { data } = await api.post("/auth/login", { email, password });
//       login(data);
//       localStorage.setItem("token", data.token);
//       setAuthToken(data.token);
//       navigate(data.user.role === "faculty" ? "/faculty" : "/student");
//     } catch (err) {
//       setError(err.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="login-wrap">
//       <div className="card login-card">
//         <h2>Login</h2>
//         <p>Faculty and Student access</p>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Email
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(event) => setEmail(event.target.value)}
//               placeholder="faculty@example.com"
//             />
//           </label>
//           <label>
//             Password
//             <input
//               type="password"
//               required
//               value={password}
//               onChange={(event) => setPassword(event.target.value)}
//               placeholder="******"
//             />
//           </label>
//           <button type="submit" disabled={loading} style={{ marginTop: 12, width: "100%" }}>
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//         {error && <p className="error">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default LoginPage;