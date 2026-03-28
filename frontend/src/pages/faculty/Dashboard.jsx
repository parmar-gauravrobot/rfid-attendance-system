// import { useEffect, useMemo, useState } from "react";
// import { Line, Bar } from "react-chartjs-2";
// import {
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LinearScale,
//   LineElement,
//   BarElement,
//   PointElement,
//   Tooltip,
// } from "chart.js";
// import api from "../../api/client";
// import Navbar from "../../components/Navbar";
// import { useAuth } from "../../context/AuthContext";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   Tooltip,
//   Legend
// );

// const Dashboard = () => {
//   const [students, setStudents] = useState([]);
//   const [attendance, setAttendance] = useState([]);
//   const [analytics, setAnalytics] = useState(null);
//   const { auth } = useAuth();

//   const loadData = async () => {
//     const [studentsRes, attendanceRes, analyticsRes] = await Promise.all([
//       api.get("/students"),
//       api.get("/attendance"),
//       api.get("/attendance/analytics"),
//     ]);

//     setStudents(studentsRes.data);
//     setAttendance(attendanceRes.data);
//     setAnalytics(analyticsRes.data);
//   };

//   useEffect(() => {
//     if (auth?.token) loadData();
//   }, [auth]);

//   const dailyChartData = useMemo(() => {
//     if (!analytics?.dailyAttendance) return null;

//     return {
//       labels: analytics.dailyAttendance.map((item) => item.date),
//       datasets: [
//         {
//           label: "Daily Attendance",
//           data: analytics.dailyAttendance.map((item) => item.count),
//           borderColor: "#0c7bdc",
//           backgroundColor: "rgba(12, 123, 220, 0.2)",
//           fill: true,
//         },
//       ],
//     };
//   }, [analytics]);

//   const percentageChartData = useMemo(() => {
//     if (!analytics?.attendancePercentageByStudent) return null;

//     return {
//       labels: analytics.attendancePercentageByStudent.map((item) => item.rollNumber),
//       datasets: [
//         {
//           label: "Attendance %",
//           data: analytics.attendancePercentageByStudent.map((item) => item.percentage),
//           backgroundColor: "#15a35b",
//         },
//       ],
//     };
//   }, [analytics]);

//   // 🔥 TOP STUDENTS
// const topStudents = analytics?.attendancePercentageByStudent
// ?.sort((a, b) => b.percentage - a.percentage)
// ?.slice(0, 3) || [];

// // ⚠ LOW ATTENDANCE
// const lowAttendance = analytics?.attendancePercentageByStudent
// ?.filter((s) => s.percentage < 40) || [];

//   return (
//     <>
//       <Navbar />
//       <main className="container">

//         {/* 🔥 STATS */}
//         <div className="stats-grid">
//           <div className="card stat-card">
//             <h4>👥 Total Students</h4>
//             <p>{students.length}</p>
//           </div>

//           <div className="card stat-card">
//             <h4>📅 Total Days</h4>
//             <p>{analytics?.totalDays || 0}</p>
//           </div>

//           <div className="card stat-card">
//             <h4>📊 Avg Attendance</h4>
//             <p>
//               {analytics?.attendancePercentageByStudent?.length
//                 ? Math.round(
//                     analytics.attendancePercentageByStudent.reduce(
//                       (acc, s) => acc + s.percentage,
//                       0
//                     ) / analytics.attendancePercentageByStudent.length
//                   )
//                 : 0}%
//             </p>
//           </div>

//           <div className="card stat-card">
//             <h4>✅ Today Present</h4>
//             <p>
//               {attendance.filter(
//                 (a) => a.date === new Date().toISOString().slice(0, 10)
//               ).length}
//             </p>
//           </div>
//         </div>

//         <div className="quick-actions">

// <button onClick={loadData}>🔄 Refresh</button>

// <button onClick={() => window.location.href = "/faculty/students"}>
//   ➕ Add Student
// </button>

// <button onClick={() => window.location.href = "/faculty/attendance"}>
//   📅 Attendance
// </button>

// <button onClick={() => window.location.href = "/faculty/analytics"}>
//   📊 Analytics
// </button>

// </div>

//         {/* HEADER */}
//         <div className="card">
//           <h2>📊 Dashboard Overview</h2>
//           <p>Quick insights of attendance system</p>
//         </div>

//         {/* CHARTS */}
//         <section className="grid">
//           <div className="card">
//             <h3>Daily Attendance</h3>
//             {dailyChartData ? <Line data={dailyChartData} /> : <p>No data</p>}
//           </div>

//           <div className="card">
//             <h3>Attendance %</h3>
//             {percentageChartData ? <Bar data={percentageChartData} /> : <p>No data</p>}
//           </div>
//         </section>

//         <div className="card">
//   <h3>🏆 Top Students</h3>

//   {topStudents.length > 0 ? (
//     topStudents.map((s, i) => (
//       <p key={s.studentId}>
//         {i + 1}. {s.rollNumber} — <strong>{s.percentage}%</strong>
//       </p>
//     ))
//   ) : (
//     <p>No data</p>
//   )}
// </div>

//       </main>
//     </>
//   );
// };

// export default Dashboard;

import { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";
// import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    const [studentsRes, attendanceRes, analyticsRes] = await Promise.all([
      api.get("/students"),
      api.get("/attendance"),
      api.get("/attendance/analytics"),
    ]);

    setStudents(studentsRes.data);
    setAttendance(attendanceRes.data);
    setAnalytics(analyticsRes.data);
  };

  useEffect(() => {
    if (auth?.token) loadData();
  }, [auth]);

  // 🔹 SMALL SUMMARY CHART ONLY
  const dailyChartData = useMemo(() => {
    if (!analytics?.dailyAttendance) return null;

    return {
      labels: analytics.dailyAttendance.map((item) => item.date),
      datasets: [
        {
          label: "Daily Attendance",
          data: analytics.dailyAttendance.map((item) => item.count),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [analytics]);

  // 🏆 TOP STUDENTS
  const topStudents =
    analytics?.attendancePercentageByStudent
      ?.sort((a, b) => b.percentage - a.percentage)
      ?.slice(0, 3) || [];

  // ⚠ LOW ATTENDANCE
  const lowAttendance =
    analytics?.attendancePercentageByStudent?.filter(
      (s) => s.percentage < 40
    ) || [];

  return (
    <>
      {/* <Navbar /> */}
      <main className="container">

        {/* 🔥 STATS */}
        <div className="stats-grid">
          <div className="card stat-card">
            <h4>👥 Total Students</h4>
            <p>{students.length}</p>
          </div>

          <div className="card stat-card">
            <h4>📅 Total Days</h4>
            <p>{analytics?.totalDays || 0}</p>
          </div>

          <div className="card stat-card">
            <h4>📊 Avg Attendance</h4>
            <p>
              {analytics?.attendancePercentageByStudent?.length
                ? Math.round(
                    analytics.attendancePercentageByStudent.reduce(
                      (acc, s) => acc + s.percentage,
                      0
                    ) /
                      analytics.attendancePercentageByStudent.length
                  )
                : 0}%
            </p>
          </div>

          <div className="card stat-card">
            <h4>✅ Today Present</h4>
            <p>
              {attendance.filter(
                (a) => a.date === new Date().toISOString().slice(0, 10)
              ).length}
            </p>
          </div>
        </div>

        <div className="top-bar">

</div>

        {/* HEADER */}


<div className="dashboard-grid">

  <div className="card chart-card">
    <h3>Daily Attendance</h3>
    {dailyChartData ? <Line data={dailyChartData} /> : <p>No data</p>}
  </div>

  <div className="card top-students">
    <h3>🏆 Top Students</h3>

    {topStudents.length > 0 ? (
      topStudents.map((s, i) => (
        <p key={s.studentId}>
          <span>{i + 1}. {s.rollNumber}</span>
          <strong>{s.percentage}%</strong>
        </p>
      ))
    ) : (
      <p>No data</p>
    )}
  </div>

</div>

      </main>
    </>
  );
};

export default Dashboard;