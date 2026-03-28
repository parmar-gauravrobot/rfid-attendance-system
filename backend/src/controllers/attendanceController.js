const { Parser } = require("json2csv");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");

const getDateString = (date = new Date()) =>
  date.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

const scanRfid = async (req, res) => {
  try {
    const { rfid_uid } = req.body;
    const deviceKey = req.headers["x-device-key"];

    if (process.env.RFID_DEVICE_KEY && deviceKey !== process.env.RFID_DEVICE_KEY) {
      return res.status(401).json({ message: "Invalid device key" });
    }

    if (!rfid_uid) {
      return res.status(400).json({ message: "rfid_uid is required" });
    }

    const student = await Student.findOne({ rfid_uid });

    if (!student) {
      return res.status(404).json({ message: "RFID not mapped to a student" });
    }

    const date = getDateString();
    const existing = await Attendance.findOne({ studentId: student._id, date });

    if (existing) {
      return res.json({
        message: "Attendance already marked for today",
        attendance: existing,
        student,
      });
    }

    const attendance = await Attendance.create({
      studentId: student._id,
      timestamp: new Date(),
      date,
    });

    return res.status(201).json({
      message: "Attendance marked",
      attendance,
      student,
    });
  } catch (error) {
    return res.status(500).json({ message: "Scan handling failed", error: error.message });
  }
};

dayjs.extend(isoWeek);

const getAttendance = async (req, res) => {
  try {
    const { date, type, studentId } = req.query;
    const filter = {};

    let baseDate = date ? dayjs(date) : dayjs(); // 🔥 key line

    // 🔥 APPLY FILTER
    if (type) {
      let start, end;

      if (type === "day") {
        start = baseDate.startOf("day");
        end = baseDate.endOf("day");
      }

      else if (type === "week") {
        start = baseDate.startOf("isoWeek"); // Monday start
        end = baseDate.endOf("isoWeek");
      }

      else if (type === "month") {
        start = baseDate.startOf("month");
        end = baseDate.endOf("month");
      }

      filter.timestamp = {
        $gte: start.toDate(),
        $lte: end.toDate(),
      };
    }

    // 🔥 STUDENT FILTER
    if (studentId) {
      filter.studentId = studentId;
    }

    const attendance = await Attendance.find(filter)
      .populate("studentId", "name rollNumber rfid_uid")
      .sort({ timestamp: -1 });

    res.json(attendance);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching attendance",
      error: error.message
    });
  }
};
// const getAttendance = async (req, res) => {
//   try {
//     const { date, from, to, studentId } = req.query;
//     const filter = {};

//     if (date) {
//       filter.date = date;
//     }

//     if (from || to) {
//       filter.timestamp = {};
//       if (from) {
//         filter.timestamp.$gte = new Date(from);
//       }
//       if (to) {
//         filter.timestamp.$lte = new Date(`${to}T23:59:59.999Z`);
//       }
//     }

//     if (studentId) {
//       filter.studentId = studentId;
//     }

//     const attendance = await Attendance.find(filter)
//       .populate("studentId", "name rollNumber rfid_uid")
//       .sort({ timestamp: -1 });

//     return res.json(attendance);
//   } catch (error) {
//     return res.status(500).json({ message: "Could not fetch attendance", error: error.message });
//   }
// };

const getAttendanceByStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role === "student") {
      const studentRecord = await Student.findOne({ userId: req.user._id });
      if (!studentRecord || studentRecord._id.toString() !== id) {
        return res.status(403).json({ message: "Forbidden" });
      }
    }

    const attendance = await Attendance.find({ studentId: id })
      .populate("studentId", "name rollNumber")
      .sort({ timestamp: -1 });

    return res.json(attendance);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch student attendance", error: error.message });
  }
};

const getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });

    if (!student) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    const [attendance, totalWorkingDays] = await Promise.all([
      Attendance.find({ studentId: student._id })
        .populate("studentId", "name rollNumber")
        .sort({ timestamp: -1 }),
      Attendance.distinct("date").then((dates) => dates.length),
    ]);

    return res.json({ student, attendance, totalWorkingDays });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch personal attendance", error: error.message });
  }
};



const getAttendanceAnalytics = async (_req, res) => {
  try {
    const [students, attendance] = await Promise.all([
      Student.find().sort({ name: 1 }),
      Attendance.find().sort({ timestamp: 1 }),
    ]);

    // ✅ SAFE unique dates
    const uniqueDates = [
      ...new Set(attendance.map((item) => item.date).filter(Boolean)),
    ].sort();

    const totalDays = uniqueDates.length || 1;

    // ✅ SAFE daily attendance
    const attendanceByDate = uniqueDates.map((d) => ({
      date: d,
      count: attendance.filter(
        (item) => item.date && item.date === d
      ).length,
    }));

    // ✅ SAFE percentage calculation
    const attendancePercentageByStudent = students.map((student) => {
      const presentDays = attendance.filter((item) => {
        if (!item.studentId) return false;

        const id =
          typeof item.studentId === "object"
            ? item.studentId._id?.toString()
            : item.studentId.toString();

        return id === student._id.toString();
      }).length;

      return {
        studentId: student._id,
        name: student.name || "N/A",
        rollNumber: student.rollNumber || "N/A",
        percentage: Number(((presentDays / totalDays) * 100).toFixed(2)),
      };
    });

    // ✅ SAFE monthly trend
    const monthlyMap = {};
    attendance.forEach((item) => {
      if (item.date) {
        const month = item.date.slice(0, 7);
        monthlyMap[month] = (monthlyMap[month] || 0) + 1;
      }
    });

    const monthlyTrend = Object.keys(monthlyMap)
      .sort()
      .map((month) => ({ month, count: monthlyMap[month] }));

    return res.json({
      dailyAttendance: attendanceByDate,
      attendancePercentageByStudent,
      monthlyTrend,
      totalStudents: students.length,
      totalDays,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not fetch analytics",
      error: error.message,
    });
  }
};



const exportAttendance = async (req, res) => {
  try {
    const { date, type } = req.query;

    const filter = {};

    // 🔥 HANDLE DAY / WEEK / MONTH
    if (date && type) {
      let startDate, endDate;

      if (type === "day") {
        startDate = dayjs(date).startOf("day").toDate();
        endDate = dayjs(date).endOf("day").toDate();
      }

      if (type === "week") {
        startDate = dayjs(date).startOf("week").toDate();
        endDate = dayjs(date).endOf("week").toDate();
      }

      if (type === "month") {
        startDate = dayjs(date).startOf("month").toDate();
        endDate = dayjs(date).endOf("month").toDate();
      }

      filter.timestamp = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const rows = await Attendance.find(filter)
      .populate("studentId", "name rollNumber rfid_uid")
      .sort({ timestamp: -1 });

    const csvRows = rows.map((item) => ({
      name: item.studentId?.name || "",
      rollNumber: item.studentId?.rollNumber || "",
      rfid_uid: item.studentId?.rfid_uid || "",
      date: item.date,
      time: dayjs(item.timestamp).format("HH:mm:ss"), // 🔥 better format
    }));

    const parser = new Parser({
      fields: ["name", "rollNumber", "rfid_uid", "date", "time"],
    });

    const csv = parser.parse(csvRows);

    res.header("Content-Type", "text/csv");
    res.attachment(`attendance-${type || "all"}-${date || "all"}.csv`);

    return res.send(csv);

  } catch (error) {
    return res.status(500).json({
      message: "CSV export failed",
      error: error.message,
    });
  }
};
module.exports = {
  scanRfid,
  getAttendance,
  getAttendanceByStudent,
  getMyAttendance,
  getAttendanceAnalytics,
  exportAttendance,
};