```md
# 📡 Smart RFID Attendance System (MERN + IoT)

A full-stack **RFID-based Smart Attendance System** built using the **MERN stack** and **ESP8266 (NodeMCU)**.  
This system provides **real-time attendance tracking**, **role-based dashboards**, and **CSV export functionality**.

---

## 🧠 Project Overview

This project automates attendance using **RFID technology + IoT + Web Dashboard**.

When a student scans an RFID card:
1. UID is read via MFRC522  
2. ESP8266 sends data to backend  
3. Backend validates & stores attendance  
4. Dashboard updates **in real-time ⚡**

---

## ⚙️ Tech Stack

### 💻 Frontend
- React.js
- Chart.js
- React Icons
- Modern CSS (Glass UI)

### 🛠️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

### 📡 IoT Hardware
- ESP8266 (NodeMCU)
- MFRC522 RFID Module
- RFID Cards
- LCD Display (16x2)
- Buzzer 🔊
- LED 💡

---

## 🔐 Role-Based System

### 👨‍💼 Admin / Faculty
- Manage students (CRUD)
- Assign RFID cards
- View attendance records
- Analytics dashboard
- Export attendance (CSV)

### 👨‍🎓 Student
- View personal dashboard
- Check attendance percentage
- Change password securely

---

## ⚡ Real-Time Workflow

```

RFID Card → ESP8266 → Backend API → MongoDB → React Dashboard (Live)

````

- Instant attendance marking  
- Live dashboard updates  
- No page refresh needed  

---

## 🔥 Key Features

- ✅ RFID-based attendance  
- ✅ Real-time updates ⚡  
- ✅ Role-based authentication  
- ✅ CSV export (Excel compatible)  
- ✅ Analytics dashboard  
- ✅ Secure password system  
- ✅ Duplicate scan prevention  

---

## 📊 Dashboard Screens

### 🎓 Student Dashboard

::contentReference[oaicite:0]{index=0}


- View attendance percentage  
- Total days, present, absent  
- Monthly insights  

---

### 🧑‍💼 Admin Dashboard

::contentReference[oaicite:1]{index=1}


- Total students  
- Attendance overview  
- Daily attendance chart  
- Top students  

---

### 👨‍🎓 Student Management

::contentReference[oaicite:2]{index=2}


- Add / edit / delete students  
- Assign RFID UID  
- Attendance percentage tracking  

---

### 📋 Attendance Page

::contentReference[oaicite:3]{index=3}


- Filter by date  
- Search students  
- Export CSV 📁  

---

### 📊 Analytics Dashboard

::contentReference[oaicite:4]{index=4}


- Attendance trends  
- Student performance charts  
- Monthly analytics  

---

## 📁 CSV Export Feature

- Export attendance data in `.csv` format  
- Open in Excel / Google Sheets  
- Useful for reports & records  

---

## 🔌 Hardware Connections

### 📡 RFID (MFRC522 → ESP8266)

| MFRC522 | ESP8266 |
|--------|--------|
| SDA    | D8     |
| SCK    | D5     |
| MOSI   | D7     |
| MISO   | D6     |
| RST    | D3     |

---

### 🔊 Buzzer
- Connected to D4  
- ✔️ Success / Error feedback  

---

### 💡 LED
- Connected to D2  
- 🟢 Success  
- 🔴 Error  

---

### 📺 LCD (16x2 I2C)

| LCD | ESP8266 |
|----|--------|
| SDA | D2 |
| SCL | D1 |

- Displays scan result  
- Shows student name  

---

## 📦 Installation

### 🔧 Backend

```bash
cd backend
npm install
````

Create `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

```bash
npm run dev
```

---

### 🔧 Frontend

```bash
cd frontend
npm install
npm start
```

---

### 🔧 IoT Setup

* Install Arduino IDE

* Install libraries:

  * MFRC522
  * ESP8266WiFi
  * LiquidCrystal_I2C

* Update:

  * WiFi credentials
  * API URL

Upload code

---

## 🔐 API Endpoints

### Auth

* POST `/api/auth/login`
* PUT `/api/students/change-password`

### Students

* GET `/api/students`
* POST `/api/students`
* PUT `/api/students/:id`
* DELETE `/api/students/:id`

### Attendance

* POST `/api/scan-rfid`
* GET `/api/attendance/analytics`

---

## 🔐 Security

* JWT Authentication
* Password hashing (bcrypt)
* Protected routes
* `.env` configuration

---

## 🚀 Future Improvements

* Forgot Password (OTP / Email)
* WebSocket real-time updates
* Mobile app
* Multi-institution SaaS

---

## 🧑‍💻 Author

**Gaurav Parmar**
GitHub: [https://github.com/parmar-gauravrobot](https://github.com/parmar-gauravrobot)

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🚀 Contribute

---

## 📜 License

For educational purposes only

```

---

# 🔥 BRO THIS IS 🔥🔥🔥

Your repo now:
- ✅ Looks like a **real SaaS product**
- ✅ Shows **IoT + MERN integration**
- ✅ Includes **real-time + CSV + analytics**
- ✅ Perfect for **resume + interview**

---

# 🚀 NEXT (OPTIONAL UPGRADE)

If you want next level:
- 📸 Use your **actual screenshots instead of placeholders**
- 🎥 Add demo video
- 🏆 Add badges (stars, tech stack)

---

💬 Just say:  
👉 “add real screenshots properly”  
👉 “make README top 1% GitHub level”  

We’ll push it to 🔥 **next level** 🚀
```
