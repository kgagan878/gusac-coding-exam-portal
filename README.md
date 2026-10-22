# CODE VERSE with Java — GUSAC Coding Exam Portal 🚀

[![Tech Stack: MERN](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-blue.svg)](https://github.com)
[![Language: Java](https://img.shields.io/badge/Exam%20Language-Java%20Only%20(SE%2017%2B)-orange.svg)](https://java.com)
[![Duration: 40 Mins](https://img.shields.io/badge/Duration-40%20Minutes-green.svg)](#)
[![Questions: 22 Questions](https://img.shields.io/badge/Questions-22%20(20%20MCQs%20%2B%202%20Coding)-purple.svg)](#)
[![Total Marks: 150 Points](https://img.shields.io/badge/Total%20Score-150%20Points-emerald.svg)](#)

A full-stack, production-grade Online Coding Examination Portal engineered for the **GITAM University Science & Activity Club (GUSAC)** flagship event **CODE VERSE with Java**. 

The portal is designed for evaluating core **Java Programming, OOP Concepts, Output Prediction, and Algorithmic Problem Solving** across a strict 40-minute examination window.

---

## 📊 Exam Structure & Scoring Model (150 Points)

| Section | Type | Questions | Marks per Question | Section Total | Evaluation Method |
|---|---|---|---|---|---|
| **Section A** | Java Output Prediction & Snippet MCQs | 20 Questions (Q1 – Q20) | **5 Points** | **100 Points** | Automated MCQ answer key verification |
| **Section B** | Java Coding Challenges | 2 Questions (Q21 – Q22) | **25 Points** | **50 Points** | Monaco Editor + Judge0 API test-case grading (partial scoring supported) |
| **Grand Total** | **Combined Evaluation** | **22 Questions** | — | **150 Points** | **Server-validated scoring** |

---

## 🌟 Key Features

### 👨‍🎓 Candidate Experience
- **Official Branding & GUSAC Logo**: Clean, modern dark-mode interface featuring the official GITAM University Science & Activity Club branding.
- **Event Rules & Guidelines**: Mandatory 16-point Event Rules modal accessible before and during the exam, plus a dedicated `/rules` route.
- **Section A — 20 Java Snippet MCQs (100 Pts)**:
  - Covers: Primitive types, type casting, String immutability, OOP (Inheritance, Polymorphism, Method Overloading/Overriding), Exception handling (`try-catch-finally`), Static initialization order, and Collections.
  - Interactive Question Navigator with color-coded status (Answered = Green, Marked for Review = Amber, Unanswered = Slate).
- **Section B — 2 Java Coding Problems (50 Pts)**:
  - Full-featured **Monaco Code Editor** with syntax highlighting, autocomplete, and theme support.
  - Safe execution sandbox powered by the **Judge0 API** (Java OpenJDK 17+).
  - Public test case runner with immediate stdout/stderr feedback and hidden test case submission grading.
- **Server-Synchronized 40-Minute Countdown**:
  - Timer calculated from server-side attempt timestamps to prevent client manipulation.
  - Automatic submission when the 40-minute limit expires.
- **Instant Result & Performance Analysis**:
  - Score displayed out of 150 with Section A (/100) and Section B (/50) subscores.
  - Question-by-question review with syntax-highlighted snippets, options, and step-by-step explanations (toggled by admin).
  - Confetti celebration animation on completion.

### 🏆 Live Leaderboard
- Real-time ranking based on:
  1. **Primary**: Highest Total Score (`/150`)
  2. **Secondary**: Lowest Completion Time (`MM:SS`)
- Top 3 podium display (Gold 🥇, Silver 🥈, Bronze 🥉) with separate Section A and Section B score columns.
- Student email masking (`r***@gitam.in`) for privacy compliance.

### 🛡️ Admin Dashboard (`/admin/login`)
- **Real-Time Overview Metrics**: Total Candidates, Completed Exams, In-Progress attempts, Average Score.
- **Candidate Management**: View live progress, section breakdown, time taken, and submission timestamps.
- **Question Bank CRUD**: Add, edit, preview, and delete Java questions, options, test cases, and explanations.
- **Configurable Exam Settings**: Toggle candidate solution explanation visibility and adjust exam duration.
- **1-Click CSV Export**: Download complete student scorecards with Section A (/100), Section B (/50), Total (/150), and timing data.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Monaco Editor (`@monaco-editor/react`), Lucide React, Canvas Confetti, Axios.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcryptjs, Express Rate Limit, Axios.
- **Code Execution**: Judge0 API (Java 17 engine) with automated fallback execution engine.
- **Database**: MongoDB (Atlas cloud connection or local/embedded MongoDB).

---

## 📁 Project Structure

```text
gusac-coding-exam/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── assets/              # GUSAC official logo
│   │   ├── components/          # Navbar, EventRulesModal, QuestionNavigator, CodeEditor, SubmitModal
│   │   ├── context/             # AuthContext, ExamContext (40-min timer, answer sync)
│   │   ├── pages/               # Login, Instructions, Rules, ExamPortal, Result, Leaderboard, AdminDashboard
│   │   ├── services/            # Axios API client (auto JWT header attachment)
│   │   ├── App.jsx              # Routes & role-based authentication guards
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json              # SPA routing rewrite rule
├── server/                      # Express.js REST API
│   ├── src/
│   │   ├── config/              # MongoDB connection & 22 Java questions bank (20 MCQs + 2 Coding)
│   │   ├── controllers/         # Auth, Exam, Question, Submission, Result, Admin controllers
│   │   ├── middleware/          # JWT auth guard, Admin guard, Rate limiter
│   │   ├── models/              # User, Question, ExamAttempt, Submission, Setting
│   │   ├── routes/              # Modular Express API endpoints
│   │   ├── scripts/             # Seed script, verify-150-points.js, verifyFullFlow.js
│   │   └── index.js             # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── render.yaml              # Production Render deployment configuration
├── .gitignore                   # Comprehensive gitignore (node_modules, .env, dist, logs, zip)
├── package.json                 # Workspace runner scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v9 or newer)
- [MongoDB Atlas](https://www.mongodb.com/atlas) or local MongoDB instance (port 27017)

---

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create local environment file from example
cp .env.example .env
```

Configure `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/gusac_exam
JWT_SECRET=your_super_secure_jwt_secret_key_2026
EXAM_DURATION_MINUTES=40
JUDGE0_API_URL=https://ce.judge0.com
JUDGE0_API_KEY=your_optional_judge0_api_key
ADMIN_EMAIL=admin@gusac.org
ADMIN_PASSWORD=your_secure_admin_password
```

> **Security Note**: Never commit `.env` to version control. The root `.gitignore` excludes all `.env` files automatically.

Seed the database with all 22 questions, default settings, and admin user:
```bash
npm run seed
```

Run automated verification:
```bash
# Verify 22 questions, 150 points schema (20 MCQs @ 5 = 100, 2 Coding @ 25 = 50)
node src/scripts/verify-150-points.js

# Verify full student flow simulation
node src/scripts/verifyFullFlow.js
```

Start the backend:
```bash
npm start
# Server runs on http://localhost:5000
# Health check available at http://localhost:5000/health
```

---

### 3. Frontend Setup

In a separate terminal:
```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create client environment file
cp .env.example .env
```

Ensure `client/.env` contains:
```env
VITE_API_URL=/api
```

Start the Vite development server:
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

To build for production:
```bash
npm run build
```

---

## 🔑 Default Credentials

### Administrator Portal
- **Login URL**: `http://localhost:3000/admin/login`
- **Email**: Configured via `ADMIN_EMAIL` (default: `admin@gusac.org`)
- **Password**: Configured via `ADMIN_PASSWORD` in `.env` (seeded default: `admin123`)

### Student Flow
- **Candidate URL**: `http://localhost:3000/exam`
- **Registration**: Enter Name, GITAM Email, and Student ID (e.g., `Rahul Sharma`, `rahul.s@gitam.in`, `GITAM202401`).

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Student login & token issuance |
| `POST` | `/api/admin/login` | Admin authentication |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/exams/start` | Start 40-minute exam attempt |
| `GET` | `/api/exams/status` | Synchronize server time left & answers |
| `POST` | `/api/exams/save-answer` | Background auto-save response |
| `POST` | `/api/exams/submit` | Finalize exam & grade answers |
| `POST` | `/api/submissions/run` | Execute code against public test cases (Judge0) |
| `POST` | `/api/submissions/submit` | Submit code against all test cases for grading |
| `GET` | `/api/questions` | Fetch 22 questions (answers & hidden tests stripped) |
| `GET` | `/api/results/:userId` | Get score out of 150 and question breakdown |
| `GET` | `/api/leaderboard` | Get ranked leaderboard (/150) |
| `GET` | `/api/admin/dashboard` | Dashboard overview statistics |
| `GET` | `/api/admin/export-csv` | Download complete results as CSV |
| `GET/PUT` | `/api/admin/settings` | Get/Update duration & explanation visibility |
| `GET/POST/PUT/DELETE` | `/api/admin/questions` | Manage question bank |

---

## ☁️ Connecting to GitHub (`gusac-coding-exam-portal`)

Follow these steps to connect and push this repository to your GitHub repository:

### Step 1: Create the Remote Repository on GitHub
1. Log into your GitHub account.
2. Click **New Repository** (or visit `https://github.com/new`).
3. Repository name: `gusac-coding-exam-portal`
4. Visibility: **Public** or **Private**.
5. **Do NOT** initialize with a README, .gitignore, or license (they are already included locally).
6. Click **Create repository**.

### Step 2: Review Staged Files & Commit
```bash
# In the project root (gusac-coding-exam):
git add .
git commit -m "feat: complete CODE VERSE with Java portal (22 questions, 150 points, Judge0 integration)"
```

### Step 3: Link Remote and Push
```bash
# Add your GitHub repository as origin (replace <YOUR_GITHUB_USERNAME> with your GitHub handle):
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/gusac-coding-exam-portal.git

# Push the main branch to GitHub:
git push -u origin main
```

---

## 🌐 Production Deployment Guide

### Deploy Frontend to Vercel
1. Import repository into Vercel.
2. Select Root Directory: `client`.
3. Framework Preset: **Vite**.
4. Set Environment Variable: `VITE_API_URL = https://your-backend-api.onrender.com/api`
5. Deploy.

### Deploy Backend to Render / Railway
1. Create a **Web Service** pointing to the repository.
2. Root Directory: `server`.
3. Build Command: `npm install`.
4. Start Command: `npm start`.
5. Environment Variables:
   - `PORT`: `5000`
   - `MONGO_URI`: `mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET`: A long random secret string
   - `EXAM_DURATION_MINUTES`: `40`
   - `ADMIN_EMAIL`: `admin@gusac.org`
   - `ADMIN_PASSWORD`: Your strong admin password
   - `JUDGE0_API_URL`: `https://ce.judge0.com`
   - `JUDGE0_API_KEY`: Your Judge0 API key (if applicable)
6. Deploy.

---

## 📄 License
Built with ❤️ for **GITAM University Science & Activity Club (GUSAC)**.
