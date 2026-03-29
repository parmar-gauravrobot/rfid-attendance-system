# RFID Attendance Management System

A complete full-stack RFID attendance platform using React, Node.js, Express, MongoDB, JWT, Chart.js, and ESP32 + RC522.

## Tech Stack
- Frontend: React + Vite + Chart.js
- Backend: Node.js + Express + JWT
- Database: MongoDB (Mongoose)
- Hardware: ESP32 + RC522 RFID Reader

## Project Structure
```text
rfid-attendance-system/
  backend/
    .env.example
    package.json
    src/
      app.js
      server.js
      config/db.js
      controllers/
        authController.js
        studentController.js
        attendanceController.js
      middleware/
        auth.js
        authorize.js
      models/
        User.js
        Student.js
        Attendance.js
      routes/
        authRoutes.js
        studentRoutes.js
        attendanceRoutes.js
      utils/
        seedFaculty.js
  frontend/
    .env.example
    index.html
    package.json
    vite.config.js
    src/
      main.jsx
      App.jsx
      index.css
      api/client.js
      context/AuthContext.jsx
      components/
        Navbar.jsx
        ProtectedRoute.jsx
      pages/
        LoginPage.jsx
        faculty/FacultyDashboard.jsx
        student/StudentDashboard.jsx
  hardware/
    esp32_rc522_attendance.ino
    README.md
```

## Database Collections
- `users`: `name`, `email`, `password`, `role`
- `students`: `name`, `rollNumber`, `rfid_uid`, `userId`
- `attendance`: `studentId`, `timestamp`, `date`

## API Endpoints
- `POST /api/auth/login`
- `POST /api/students`
- `GET /api/students`
- `POST /api/scan-rfid`
- `GET /api/attendance`
- `GET /api/attendance/student/:id`
- `GET /api/attendance/export`

Additional helper endpoints:
- `GET /api/attendance/me` (student dashboard)
- `GET /api/attendance/analytics` (faculty charts)

## Features
### Authentication
- JWT-based login system
- Role-based access (`faculty`, `student`)
- Separate faculty/student dashboards

### Faculty Dashboard
- Register student with `name`, `rollNumber`, `rfid_uid`, `email`, `password`
- View all students
- View and filter attendance by date
- Export attendance to CSV
- Charts:
  - Daily attendance chart
  - Attendance percentage per student
  - Monthly attendance trend

### Student Dashboard
- Login with email and password
- View personal attendance history
- Attendance percentage display
- Charts for distribution and monthly trend

### RFID Flow
- ESP32 reads UID from RC522
- Sends UID to backend via `POST /api/scan-rfid`
- Backend maps UID to student and marks attendance with timestamp

## Installation
### 1) Clone and move into project
```bash
git clone <your-repo-url>
cd rfid-attendance-system
```

### 2) Backend setup
```bash
cd backend
npm install
copy .env.example .env
```

Update `backend/.env`:
- `MONGO_URI`
- `JWT_SECRET`
- `RFID_DEVICE_KEY`
- `CORS_ORIGIN`

Seed faculty account:
```bash
npm run seed:faculty
```

Run backend:
```bash
npm run dev
```

### 3) Frontend setup
```bash
cd ../frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

## .env Configuration
### backend/.env
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/rfid_attendance
JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=1d
RFID_DEVICE_KEY=replace_with_device_key
CORS_ORIGIN=http://localhost:5173
FACULTY_NAME=Admin Faculty
FACULTY_EMAIL=faculty@example.com
FACULTY_PASSWORD=faculty123
```

### frontend/.env
```env
VITE_API_URL=http://localhost:5000/api
```

## Running Locally
1. Start MongoDB service
2. Run backend (`npm run dev` in `backend/`)
3. Run frontend (`npm run dev` in `frontend/`)
4. Login as faculty using seeded credentials
5. Register students with RFID UID + email/password
6. Start ESP32 firmware and scan cards to mark attendance

## Hardware Wiring (ESP32 + RC522)
- `SDA (SS)` -> `GPIO5`
- `SCK` -> `GPIO18`
- `MOSI` -> `GPIO23`
- `MISO` -> `GPIO19`
- `RST` -> `GPIO22`
- `3.3V` -> `3V3`
- `GND` -> `GND`

Important:
- Use local backend IP in firmware (not `localhost`)
- Keep `x-device-key` in ESP32 code equal to `RFID_DEVICE_KEY` in backend `.env`

## ESP32 Firmware Setup
1. Open `hardware/esp32_rc522_attendance.ino` in Arduino IDE.
2. Install libraries:
   - `MFRC522`
   - `WiFi` (built-in for ESP32)
   - `HTTPClient` (built-in)
3. Set values in sketch:
   - `ssid`
   - `password`
   - `apiEndpoint` (e.g., `http://192.168.1.10:5000/api/scan-rfid`)
   - `deviceKey`
4. Select ESP32 board and COM port.
5. Upload and open Serial Monitor at `115200` baud.

## Notes
- `POST /api/scan-rfid` allows one attendance mark per student per date.
- CSV export works with optional date filter.
- If your PC firewall blocks incoming traffic, allow port `5000` for ESP32 access.