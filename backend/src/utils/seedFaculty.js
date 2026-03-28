const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = (process.env.FACULTY_EMAIL || "faculty@example.com").toLowerCase();
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Faculty user already exists");
      process.exit(0);
    }

    await User.create({
      name: process.env.FACULTY_NAME || "Admin Faculty",
      email,
      password: process.env.FACULTY_PASSWORD || "faculty123",
      role: "faculty",
    });

    console.log("Faculty user seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed faculty user", error);
    process.exit(1);
  }
};

run();