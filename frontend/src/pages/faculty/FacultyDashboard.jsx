import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Bar, Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  BarElement,
  PointElement,
  Tooltip,
} from "chart.js";
import api from "../../api/client";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend
);

const FacultyDashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    rollNumber: "",
    rfid_uid: "",
    email: "",
    password: "",
  });

  const loadData = async (date = "") => {
    try {
      const attendancePath = date ? `/attendance?date=${date}` : "/attendance";
      const [studentsRes, attendanceRes, analyticsRes] = await Promise.all([
        api.get("/students"),
        api.get(attendancePath),
        api.get("/attendance/analytics"),
      ]);

      setStudents(studentsRes.data);
      setAttendance(attendanceRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    }
  };

  useEffect(() => {
    if (auth?.token) {
      loadData();
    }
  }, [auth]);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleCreateStudent = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/students", form);
      setSuccess("Student registered successfully");
      setForm({ name: "", rollNumber: "", rfid_uid: "", email: "", password: "" });
      loadData(dateFilter);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register student");
    }
  };

  const handleDateFilter = async (event) => {
    const value = event.target.value;
    setDateFilter(value);
    await loadData(value);
  };

  const handleExport = async () => {
    try {
      const endpoint = dateFilter ? `/attendance/export?date=${dateFilter}` : "/attendance/export";
      const response = await api.get(endpoint, { responseType: "blob" });
      const blobUrl = URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `attendance-${dateFilter || "all"}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.response?.data?.message || "CSV export failed");
    }
  };

  const dailyChartData = useMemo(() => {
    if (!analytics?.dailyAttendance) return null;

    return {
      labels: analytics.dailyAttendance.map((item) => item.date),
      datasets: [
        {
          label: "Daily Attendance",
          data: analytics.dailyAttendance.map((item) => item.count),
          borderColor: "#0c7bdc",
          backgroundColor: "rgba(12, 123, 220, 0.2)",
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [analytics]);

  const percentageChartData = useMemo(() => {
    if (!analytics?.attendancePercentageByStudent) return null;

    return {
      labels: analytics.attendancePercentageByStudent.map((item) => item.rollNumber),
      datasets: [
        {
          label: "Attendance %",
          data: analytics.attendancePercentageByStudent.map((item) => item.percentage),
          backgroundColor: "#15a35b",
        },
      ],
    };
  }, [analytics]);

  const monthlyTrendChartData = useMemo(() => {
    if (!analytics?.monthlyTrend) return null;

    return {
      labels: analytics.monthlyTrend.map((item) => item.month),
      datasets: [
        {
          label: "Monthly Attendance Trend",
          data: analytics.monthlyTrend.map((item) => item.count),
          borderColor: "#f58b00",
          backgroundColor: "rgba(245, 139, 0, 0.2)",
          fill: true,
        },
      ],
    };
  }, [analytics]);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(search.toLowerCase())
  );
  const getPercentage = (studentId) => {
    if (!analytics?.attendancePercentageByStudent) return 0;
  
    const found = analytics.attendancePercentageByStudent.find(
      (s) => s.studentId === studentId
    );
  
    return found ? found.percentage : 0;
  };
  return (
    <>
      <Navbar />
      <main className="container">
      <div className="stats-grid">

<div className="card stat-card total">
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
          ) / analytics.attendancePercentageByStudent.length
        )
      : 0}%
  </p>
</div>

<div className="card stat-card present">
  <h4>✅ Today Present</h4>
  <p>
    {attendance.filter(
      (a) => a.date === new Date().toISOString().slice(0, 10)
    ).length}
  </p>
</div>

</div>
        <div className="card">
          <h2>Faculty Dashboard</h2>
          <p>Manage students, monitor attendance, and export reports.</p>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>

        <div className="grid">
          <section className="card">
            <h3>Register Student</h3>
            <form onSubmit={handleCreateStudent}>
              <label>
                Name
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                Roll Number
                <input name="rollNumber" value={form.rollNumber} onChange={handleChange} required />
              </label>
              <label>
                RFID UID
                <input name="rfid_uid" value={form.rfid_uid} onChange={handleChange} required />
              </label>
              <label>
                Email
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  minLength={6}
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </label>
              <button type="submit" style={{ marginTop: 12 }}>
                Add Student
              </button>
            </form>
          </section>

          <section className="card">
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
    <h3>Students ({students.length})</h3>

    <input
      placeholder="🔍 Search student..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc"
      }}
    />
  </div>

  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Roll</th>
          <th>RFID UID</th>
          <th>Email</th>
          <th>Attendance %</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.map((student) => {
          const percent = getPercentage(student._id);

          let color = "#dc2626"; // red
          if (percent > 75) color = "#16a34a";
          else if (percent > 40) color = "#f59e0b";

          return (
            <tr key={student._id}>
              <td>{student.name}</td>
              <td>{student.rollNumber}</td>
              <td>{student.rfid_uid}</td>
              <td>{student.userId?.email || "-"}</td>
              <td>
                <span
                  style={{
                    background: color,
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    fontSize: "12px"
                  }}
                >
                  {percent}%
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
</section>
        </div>

        <section className="card">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h3>Daily Attendance Records</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="date" value={dateFilter} onChange={handleDateFilter} />
              <button onClick={handleExport}>Export CSV</button>
            </div>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll</th>
                  <th>Date</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((item) => (
                  <tr key={item._id}>
                    <td>{item.studentId?.name}</td>
                    <td>{item.studentId?.rollNumber}</td>
                    <td>{item.date}</td>
                    <td>{dayjs(item.timestamp).format("YYYY-MM-DD HH:mm:ss")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid">
          <div className="card">
            <h3>Daily Attendance Chart</h3>
            {dailyChartData ? <Line data={dailyChartData} /> : <p>No data</p>}
          </div>
          <div className="card">
            <h3>Attendance Percentage Per Student</h3>
            {percentageChartData ? <Bar data={percentageChartData} /> : <p>No data</p>}
          </div>
          <div className="card">
            <h3>Monthly Attendance Trend</h3>
            {monthlyTrendChartData ? <Line data={monthlyTrendChartData} /> : <p>No data</p>}
          </div>
        </section>
      </main>
    </>
  );
};

export default FacultyDashboard;