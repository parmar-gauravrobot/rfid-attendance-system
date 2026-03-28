import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Doughnut, Line } from "react-chartjs-2";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import api from "../../api/client";
import StudentNavbar from "../../components/navbar/StudentNavbar";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [totalWorkingDays, setTotalWorkingDays] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get("/attendance/me");
        setStudent(data.student);
        setAttendance(data.attendance || []);
        setTotalWorkingDays(data.totalWorkingDays || 0);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load attendance");
      }
    };
    load();
  }, []);

  const percentage = useMemo(() => {
    if (!totalWorkingDays) return 0;
    return Number(((attendance.length / totalWorkingDays) * 100).toFixed(2));
  }, [attendance.length, totalWorkingDays]);

  const absentDays = Math.max(totalWorkingDays - attendance.length, 0);

  const distributionData = {
    labels: ["Present", "Absent"],
    datasets: [
      {
        data: [attendance.length, absentDays],
        backgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  const monthlyTrendData = useMemo(() => {
    const monthlyMap = {};
    attendance.forEach((item) => {
      if (item.date) {
        const month = item.date.slice(0, 7);
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
      }
    });

    const labels = Object.keys(monthlyMap).sort();

    return {
      labels,
      datasets: [
        {
          label: "Monthly Attendance",
          data: labels.map((m) => monthlyMap[m]),
          borderColor: "#2563eb",
          backgroundColor: "rgba(37, 99, 235, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }, [attendance]);

  const [showAll, setShowAll] = useState(false);

const sortedAttendance = useMemo(() => {
  return [...attendance].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );
}, [attendance]);

const visibleAttendance = showAll
  ? sortedAttendance
  : sortedAttendance.slice(0, 5);
  return (
    <>
      <StudentNavbar />
      <main className="container">

        {/* HEADER */}
        {/* <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2>👋 Welcome, {student?.name}</h2>
            <p>Roll No: {student?.rollNumber}</p>
          </div>
          <div style={{
            background: "#2563eb",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "10px",
            fontWeight: "bold"
          }}>
            {percentage}%
          </div>
        </div> */}
        <div
  className="card"
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
  }}
>
  {/* LEFT SIDE */}
  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
    
    {/* Avatar */}
    <div
      style={{
        width: "50px",
        height: "50px",
        borderRadius: "50%",
        background: "#2563eb",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      {student?.name?.charAt(0)}
    </div>

    <div>
      <h2 style={{ margin: 0 }}>Welcome, {student?.name}</h2>
      <p style={{ margin: "5px 0", color: "#555" }}>
        Roll No: {student?.rollNumber}
      </p>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div style={{ textAlign: "right" }}>
    
    {/* Percentage Box */}
    <div
      style={{
        background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "12px",
        fontWeight: "bold",
        fontSize: "18px",
      }}
    >
      {percentage}%
    </div>

    {/* Progress Bar */}
    <div
      style={{
        marginTop: "10px",
        width: "150px",
        height: "8px",
        background: "#e5e7eb",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          background: percentage > 75 ? "#16a34a" : percentage > 40 ? "#f59e0b" : "#dc2626",
          transition: "0.3s",
        }}
      />
    </div>
  </div>
</div>

        {/* STATS */}
        <section className="grid">
          <div className="card total">
            <h4>📅 Total Days</h4>
            <h2>{totalWorkingDays}</h2>
          </div>
          <div className="card present">
            <h4>✅ Present</h4>
            <h2 style={{ color: "#16a34a" }}>{attendance.length}</h2>
          </div>
          <div className="card absent">
            <h4>❌ Absent</h4>
            <h2 style={{ color: "#dc2626" }}>{absentDays}</h2>
          </div>
        </section>

        {/* CHARTS */}
        <section className="grid">
          <div className="card">
            <h3>Attendance Distribution</h3>
            {/* <Doughnut data={distributionData} /> */}
            <div style={{ maxWidth: "300px", margin: "0 auto" }}>
              <Doughnut data={distributionData} />
            </div>
          </div>
          <div className="card">
            <h3>Monthly Attendance Trend</h3>
            <Line data={monthlyTrendData} />
          </div>
        </section>

        {/* TABLE */}
        <section className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h3>📋 Personal Attendance History</h3>

  <button
    onClick={() => setShowAll(!showAll)}
    style={{
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: "6px",
      cursor: "pointer"
    }}
  >
    {showAll ? "Show Less" : "Show More"}
  </button>
</div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleAttendance.map((item) => (
                  <tr key={item._id}>
                    <td>{item.date}</td>
                    <td>{dayjs(item.timestamp).format("HH:mm:ss")}</td>
                    <td>
                      <span style={{
                        background: "#16a34a",
                        color: "#fff",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px"
                      }}>
                        Present
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {error && <p className="error">{error}</p>}
      </main>
    </>
  );
};

export default StudentDashboard;


// import { useEffect, useMemo, useState } from "react";
// import dayjs from "dayjs";
// import { Doughnut, Line } from "react-chartjs-2";
// import {
//   ArcElement,
//   CategoryScale,
//   Chart as ChartJS,
//   Legend,
//   LinearScale,
//   LineElement,
//   PointElement,
//   Tooltip,
// } from "chart.js";
// import api from "../../api/client";
// import Navbar from "../../components/Navbar";

// ChartJS.register(
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// const StudentDashboard = () => {
//   const [student, setStudent] = useState(null);
//   const [attendance, setAttendance] = useState([]);
//   const [totalWorkingDays, setTotalWorkingDays] = useState(0);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const { data } = await api.get("/attendance/me");
//         setStudent(data.student);
//         setAttendance(data.attendance || []);
//         setTotalWorkingDays(data.totalWorkingDays || 0);
//       } catch (err) {
//         setError(err.response?.data?.message || "Could not load attendance");
//       }
//     };

//     load();
//   }, []);

//   const percentage = useMemo(() => {
//     if (!totalWorkingDays) return 0;
//     return Number(((attendance.length / totalWorkingDays) * 100).toFixed(2));
//   }, [attendance.length, totalWorkingDays]);

//   const distributionData = useMemo(() => {
//     const absentDays = Math.max(totalWorkingDays - attendance.length, 0);
//     return {
//       labels: ["Present", "Absent"],
//       datasets: [
//         {
//           data: [attendance.length, absentDays],
//           backgroundColor: ["#15a35b", "#d34a4a"],
//         },
//       ],
//     };
//   }, [attendance.length, totalWorkingDays]);

//   const monthlyTrendData = useMemo(() => {
//     const monthlyMap = {};
//     attendance.forEach((item) => {
//       const month = item.date.slice(0, 7);
//       monthlyMap[month] = (monthlyMap[month] || 0) + 1;
//     });

//     const labels = Object.keys(monthlyMap).sort();

//     return {
//       labels,
//       datasets: [
//         {
//           label: "Monthly Attendance",
//           data: labels.map((month) => monthlyMap[month]),
//           borderColor: "#0c7bdc",
//           backgroundColor: "rgba(12, 123, 220, 0.2)",
//           fill: true,
//         },
//       ],
//     };
//   }, [attendance]);

//   return (
//     <>
//       <Navbar />
//       <main className="container">
//         <div className="card">
//           <h2>Student Dashboard</h2>
//           {student && (
//             <p>
//               {student.name} ({student.rollNumber})
//             </p>
//           )}
//           <p>
//             Attendance Percentage: <strong>{percentage}%</strong>
//           </p>
//           {error && <p className="error">{error}</p>}
//         </div>

//         <section className="grid">
//           <div className="card">
//             <h3>Attendance Distribution</h3>
//             <Doughnut data={distributionData} />
//           </div>
//           <div className="card">
//             <h3>Monthly Attendance Trend</h3>
//             <Line data={monthlyTrendData} />
//           </div>
//         </section>

//         <section className="card">
//           <h3>Personal Attendance History</h3>
//           <div className="table-wrap">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Date</th>
//                   <th>Timestamp</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {attendance.map((item) => (
//                   <tr key={item._id}>
//                     <td>{item.date}</td>
//                     <td>{dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>
//     </>
//   );
// };

// export default StudentDashboard;