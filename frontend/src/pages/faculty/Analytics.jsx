import { useEffect, useMemo, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
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

const Analytics = () => {
  const { auth } = useAuth();

  const [analytics, setAnalytics] = useState(null);

  const loadData = async () => {
    const res = await api.get("/attendance/analytics");
    setAnalytics(res.data);
  };

  useEffect(() => {
    if (auth?.token) loadData();
  }, [auth]);

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
          backgroundColor: "#16a34a",
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
          label: "Monthly Trend",
          data: analytics.monthlyTrend.map((item) => item.count),
          borderColor: "#f59e0b",
          backgroundColor: "rgba(245, 158, 11, 0.2)",
          fill: true,
        },
      ],
    };
  }, [analytics]);

  return (
    <>
      <main className="container">

        {/* HEADER */}
        <div className="card">
          <h2>📈 Analytics & Reports</h2>
          <p>Visual insights of attendance data</p>
        </div>

        {/* CHARTS */}
        <section className="grid">

          <div className="card">
            <h3>Daily Attendance</h3>
            {dailyChartData ? <Line data={dailyChartData} /> : <p>No data</p>}
          </div>

          <div className="card">
            <h3>Attendance % Per Student</h3>
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

export default Analytics;