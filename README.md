# EduTrack - Student Performance Analytics Platform

EduTrack is a full-stack web application designed for educational administrators to monitor, manage, and analyze student academic performance across subjects and monthly assessment cycles.

---

## 1. Project Overview
EduTrack enables administrators to view student records, execute server-side search queries, manage student details & monthly subject marks, and inspect real-time visual analytics including subject trend line charts and comparative bar graphs.

---

## 2. Key Features
- **Opening Collision Animation**: Dynamic "Edu" + "Track" intro animation colliding in the center with particle shockwave glow.
- **Admin Authentication**: JWT-based authentication with bcrypt password verification (`admin` / `password123`).
- **⚡ 1-Click Demo Login**: Instant login button on the login screen for testing.
- **Dashboard Summary Cards**: Dynamic statistics computed from the database:
  - Total Students
  - Overall Platform Average
  - Top Performing Student
  - Students Needing Attention (< 50% avg)
- **Student Roster Management**:
  - Max **10 students per page** with full pagination (Previous, Next, Page Numbers).
  - Add Student modal drawer with 4 subjects x 6 months (24 marks) validation (0 - 100).
  - Edit Student modal pre-populated with existing database records.
  - Delete Student confirmation modal dialog ("Delete Rahul?").
- **Server-Side Search**:
  - Partial name & token matching search with frontend input debouncing (300ms).
- **Single Student Analytics Panel (Right Side Drawer)**:
  - Updates instantly on student selection without page reload.
  - **4 Line Charts (Recharts)** for subject performance trends (Telugu, Hindi, English, Social Studies).
  - **1 Bar Chart** for Subject Average Comparison.
  - Dynamic data-driven insights computed from marks.
- **Modern UI & SaaS Aesthetic**:
  - Light mode & Dark mode toggle with persistent state.
  - Clean Tailwind CSS design, skeleton loading states, and toast notifications.

---

## 3. Technology Stack
- **Frontend**: React.js, TypeScript, Vite, Tailwind CSS, Recharts, Lucide React, React Router DOM v6.
- **Backend**: Node.js, Express.js, TypeScript, JWT (`jsonwebtoken`), bcrypt (`bcryptjs`), Cors, Helmet, express-rate-limit.
- **Database**: SQLite with Prisma ORM (stored in `backend/prisma/dev.db`, zero setup required!).

---

## 4. Local Setup (Zero Hassle - 1 Minute)

### Prerequisites
- Node.js (v18+ or v20+)

### Backend Setup (Terminal 1)
```bash
cd backend
npm install
npm run setup   # Automatically creates SQLite database & seeds 105 students with 2,520 marks!
npm run dev     # Starts backend on http://localhost:5000
```

### Frontend Setup (Terminal 2)
```bash
cd frontend
npm install
npm run dev     # Starts frontend on http://localhost:5173
```

Open `http://localhost:5173` in your browser and click **⚡ 1-Click Instant Demo Login**!
