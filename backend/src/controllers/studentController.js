const mongoose = require("mongoose");
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");


const createStudent = async (req, res) => {
  try {
    const { name, rollNumber, rfid_uid, email, password } = req.body;

    if (!name || !rollNumber || !rfid_uid || !email || !password) {
      return res.status(400).json({
        message: "name, rollNumber, rfid_uid, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const existingStudent = await Student.findOne({
      $or: [{ rollNumber }, { rfid_uid }],
    });

    if (existingStudent) {
      return res.status(409).json({ message: "Roll number or RFID UID already exists" });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: "student",
    });

    const student = await Student.create({
      name,
      rollNumber,
      rfid_uid,
      userId: user._id,
    });

    return res.status(201).json(student);
  } catch (error) {
    return res.status(500).json({ message: "Could not create student", error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("userId", "email")
      .sort({ createdAt: -1 });

    return res.json(students);
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch students", error: error.message });
  }
};

// const updateStudent = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id);

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     student.name = req.body.name || student.name;
//     student.password = req.body.password || student.password;


//     await student.save();

//     res.json({ message: "Student updated", student });
//   } catch (err) {
//     res.status(500).json({ message: "Error updating student" });
//   }
// };


const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Update name
    if (req.body.name !== undefined) {
      student.name = req.body.name;
    }

    // ✅ Update password (only if provided)
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(req.body.password, salt);
    }

    await student.save();

    res.json({ message: "Student updated", student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating student" });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id;

    console.log("Incoming ID:", id);

    // 🔥 Convert to ObjectId explicitly
    const objectId = new mongoose.Types.ObjectId(id);

    const deleted = await Student.findOneAndDelete({ _id: objectId });

    if (!deleted) {
      console.log("❌ Student not found in DB");
      return res.status(404).json({
        message: "Student not found",
      });
    }

    console.log("✅ Deleted:", deleted.name);

    res.json({
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({
      message: "Error deleting student",
    });
  }
};
module.exports = { createStudent, getStudents, updateStudent,deleteStudent };