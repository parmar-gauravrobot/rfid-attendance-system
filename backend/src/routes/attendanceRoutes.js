const express = require("express");
const {
  scanRfid,
  getAttendance,
  getAttendanceByStudent,
  getMyAttendance,
  getAttendanceAnalytics,
  exportAttendance,
} = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const router = express.Router();

router.post("/scan-rfid", scanRfid);
router.get("/attendance", protect, authorize("faculty"), getAttendance);
router.get("/attendance/student/:id", protect, getAttendanceByStudent);
router.get("/attendance/me", protect, authorize("student"), getMyAttendance);
router.get("/attendance/analytics", protect, authorize("faculty"), getAttendanceAnalytics);
router.get("/attendance/export", protect, authorize("faculty"), exportAttendance);

module.exports = router;