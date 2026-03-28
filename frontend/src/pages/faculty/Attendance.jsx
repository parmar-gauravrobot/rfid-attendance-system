import { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

const Attendance = () => {
  const { auth } = useAuth();

  const [attendance, setAttendance] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [filterType, setFilterType] = useState("day"); // 🔥 NEW
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      let endpoint = "/attendance";

      // if (dateFilter) {
      //   endpoint += `?date=${dateFilter}&type=${filterType}`;
      // }

      endpoint += `?type=${filterType}`;

      if (dateFilter) {
        endpoint += `&date=${dateFilter}`;
      }

      const res = await api.get(endpoint);
      setAttendance(res.data);

    } catch {
      setError("Failed to load attendance");
    }
  };

  useEffect(() => {
    if (auth?.token) loadData();
  }, [auth, dateFilter, filterType]); // 🔥 UPDATED

  const handleExport = async () => {
    try {
      let endpoint = "/attendance/export";

      if (dateFilter) {
        endpoint += `?date=${dateFilter}&type=${filterType}`;
      }

      const res = await api.get(endpoint, { responseType: "blob" });

      const blobUrl = URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `attendance-${filterType}-${dateFilter || "all"}.csv`;
      link.click();

    } catch {
      setError("Export failed");
    }
  };

  // 🔥 FILTERED DATA (SEARCH)
  const filteredData = attendance.filter((item) =>
    item.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
    item.studentId?.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 STATS
  const total = filteredData.length;
  const lastScan = filteredData[0]?.studentId?.name || "--";

  return (
    <main className="container">

      {/* 🔥 STATS */}
      <div className="stats-grid">
        <div className="card-base card-attendance">
          <p>Total Records</p>
          <h3>{total}</h3>
        </div>

        <div className="card-base card-attendance blue">
          <p>Last Scan</p>
          <h3>{lastScan}</h3>
        </div>

        <div className="card-base card-attendance green">
          <p>Status</p>
          <h3>
            <span className="live-dot"></span> Live
          </h3>
        </div>
      </div>

      {/* 🔥 FILTER TOOLBAR */}
      <div className="card-base toolbar">

        {/* FILTER TYPE */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="day">📅 Day</option>
          <option value="week">📆 Week</option>
          <option value="month">🗓 Month</option>
        </select>

        {/* DATE */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* EXPORT */}
        <button className="primary-btn" onClick={handleExport}>
          ⬇ Export CSV
        </button>

      </div>

      {/* TABLE */}
      <section className="card-base">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.map((item) => (
                <tr key={item._id}>
                  <td>{item.studentId?.name}</td>
                  <td>{item.studentId?.rollNumber}</td>
                  <td>{item.date}</td>
                  <td>{dayjs(item.timestamp).format("HH:mm:ss")}</td>
                  <td>
                    <span className="status present">Present</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <p className="empty">📭 No records found</p>
          )}
        </div>
      </section>

    </main>
  );
};

export default Attendance;

// import { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import api from "../../api/client";
// import { useAuth } from "../../context/AuthContext";

// const Attendance = () => {
//   const { auth } = useAuth();

//   const [attendance, setAttendance] = useState([]);
//   const [dateFilter, setDateFilter] = useState("");
//   const [search, setSearch] = useState("");
//   const [error, setError] = useState("");

//   const loadData = async (date = "") => {
//     try {
//       const endpoint = date ? `/attendance?date=${date}` : "/attendance";
//       const res = await api.get(endpoint);
//       setAttendance(res.data);
//     } catch {
//       setError("Failed to load attendance");
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) loadData();
//   }, [auth]);

//   const handleDateFilter = (e) => {
//     const value = e.target.value;
//     setDateFilter(value);
//     loadData(value);
//   };

//   const handleExport = async () => {
//     try {
//       const endpoint = dateFilter
//         ? `/attendance/export?date=${dateFilter}`
//         : "/attendance/export";

//       const res = await api.get(endpoint, { responseType: "blob" });

//       const blobUrl = URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `attendance-${dateFilter || "all"}.csv`;
//       link.click();
//     } catch {
//       setError("Export failed");
//     }
//   };

//   // 🔥 FILTERED DATA
//   const filteredData = attendance.filter((item) =>
//     item.studentId?.name.toLowerCase().includes(search.toLowerCase()) ||
//     item.studentId?.rollNumber.toLowerCase().includes(search.toLowerCase())
//   );

//   // 🔥 STATS
//   const total = filteredData.length;
//   const lastScan = filteredData[0]?.studentId?.name || "--";

//   return (
//     <main className="container">

//       {/* HEADER */}


//       {/* 🔥 STATS */}
//       <div className="attendance-stats">
//         <div className="stat-card">
//           <p>Total Records</p>
//           <h3>{total}</h3>
//         </div>

//         <div className="stat-card blue">
//           <p>Last Scan</p>
//           <h3>{lastScan}</h3>
//         </div>

//         <div className="stat-card green">
//           <p>Status</p>
//           <h3>
//             <span className="live-dot"></span> Live
//           </h3>
//         </div>
//       </div>

//       {/* FILTER + SEARCH + EXPORT */}
//       <div className="card toolbar">

//         <input
//           type="date"
//           value={dateFilter}
//           onChange={handleDateFilter}
//         />

//         <input
//           type="text"
//           placeholder="Search student..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <button className="primary-btn" onClick={handleExport}>
//           ⬇ Export CSV
//         </button>

//       </div>

//       {/* TABLE */}
//       <section className="card">
//         <div className="table-wrap">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Roll</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.map((item) => (
//                 <tr key={item._id}>
//                   <td>{item.studentId?.name}</td>
//                   <td>{item.studentId?.rollNumber}</td>
//                   <td>{item.date}</td>
//                   <td>{dayjs(item.timestamp).format("HH:mm:ss")}</td>
//                   <td>
//                     <span className="status present">Present</span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredData.length === 0 && (
//             <p className="empty">📭 No records found</p>
//           )}
//         </div>
//       </section>

//     </main>
//   );
// };

// export default Attendance;

// import { useEffect, useState } from "react";
// import dayjs from "dayjs";
// import api from "../../api/client";
// import { useAuth } from "../../context/AuthContext";

// const Attendance = () => {
//   const { auth } = useAuth();

//   const [attendance, setAttendance] = useState([]);
//   const [dateFilter, setDateFilter] = useState("");
//   const [error, setError] = useState("");

//   const loadData = async (date = "") => {
//     try {
//       const endpoint = date ? `/attendance?date=${date}` : "/attendance";
//       const res = await api.get(endpoint);
//       setAttendance(res.data);
//     } catch {
//       setError("Failed to load attendance");
//     }
//   };

//   useEffect(() => {
//     if (auth?.token) loadData();
//   }, [auth]);

//   const handleDateFilter = async (e) => {
//     const value = e.target.value;
//     setDateFilter(value);
//     loadData(value);
//   };

//   const handleExport = async () => {
//     try {
//       const endpoint = dateFilter
//         ? `/attendance/export?date=${dateFilter}`
//         : "/attendance/export";

//       const res = await api.get(endpoint, { responseType: "blob" });

//       const blobUrl = URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = blobUrl;
//       link.download = `attendance-${dateFilter || "all"}.csv`;
//       link.click();
//     } catch {
//       setError("Export failed");
//     }
//   };

//   return (
//     <>
//       <main className="container">

//         {/* HEADER */}
//         <div className="card">
//           <h2>📅 Attendance Records</h2>
//           <p>View and export attendance data</p>
//           {error && <p className="error">{error}</p>}
//         </div>

//         {/* FILTER + EXPORT */}
//         <div className="card" style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
//           <input
//             type="date"
//             value={dateFilter}
//             onChange={handleDateFilter}
//           />

//           <button onClick={handleExport}>
//             ⬇ Export CSV
//           </button>
//         </div>

//         {/* TABLE */}
//         <section className="card">
//           <div className="table-wrap">
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>Name</th>
//                   <th>Roll</th>
//                   <th>Date</th>
//                   <th>Time</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {attendance.map((item) => (
//                   <tr key={item._id}>
//                     <td>{item.studentId?.name}</td>
//                     <td>{item.studentId?.rollNumber}</td>
//                     <td>{item.date}</td>
//                     <td>{dayjs(item.timestamp).format("HH:mm:ss")}</td>
//                   </tr>
//                 ))}
//               </tbody>

//             </table>

//             {attendance.length === 0 && (
//               <p style={{ textAlign: "center", marginTop: 10 }}>
//                 📭 No records found
//               </p>
//             )}
//           </div>
//         </section>

//       </main>
//     </>
//   );
// };

// export default Attendance;