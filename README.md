# GUSAC Online Coding Exam Portal 🚀

[![Tech Stack: MERN](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-blue.svg)](https://github.com)
[![Language: Java](https://img.shields.io/badge/Exam%20Language-Java%20Only-orange.svg)](https://java.com)
[![Duration: 40 Mins](https://img.shields.io/badge/Duration-40%20Minutes-green.svg)](#)
[![Questions: 20 MCQs](https://img.shields.io/badge/Questions-20%20Java%20Snippets-purple.svg)](#)

A full-stack, production-grade Online Coding Examination Portal engineered for the **GITAM University Science & Activity Club (GUSAC)**. The portal is specifically tailored for evaluating core **Java Programming, OOP concepts, Output Prediction, and Algorithmic Reasoning** through 20 curated snippet questions within a strict 40-minute window.

---

## 🌟 Key Features

### 👨‍🎓 Student Experience
- **Simple Onboarding**: Quick student sign-in with **Full Name**, **GITAM Email**, and **Roll Number / Student ID**.
- **Official Instructions**: Detailed rules, 40-minute countdown guidelines, scoring schema (+1 mark per correct answer, no negative marking), and review system guidelines.
- **20-Question Java Snippet Bank**:
  - Multiple-choice format with code snippet cards.
  - Covers: Primitive types, type casting, String immutability, OOP (Inheritance, Polymorphism, Method Overloading/Overriding), Exception handling (`try-catch-finally`), Static initialization order, and Collections.
- **Interactive Question Navigator**:
  - Color-coded question grid (Answered = Green, Marked for Review = Amber, Unanswered = Slate).
  - Clear response button and 1-click review toggling.
  - Seamless Next / Previous / Grid-based jumping.
- **Server-Synchronized Timer**:
  - 40:00 countdown timer tied directly to backend timestamps to prevent client-side tampering.
  - Automatically submits when the timer runs out.
- **Instant Result & Performance Analysis**:
  - Final score displayed out of 20 with accuracy percentage and time taken.
  - Full Question-by-Question breakdown accordion with syntax-highlighted code snippets, option selections, and deep explanations (controlled by admin toggle).
  - Animated celebration confetti on completion.

### 🏆 Live Leaderboard
- Real-time ranking calculated by:
  1. **Primary**: Highest Total Score (`/20`)
  2. **Secondary**: Lowest Time Taken (`MM:SS`)
- Prominent Top 3 podium display (Gold 🥇, Silver 🥈, Bronze 🥉).
- Masked student emails (`r***@gitam.in`) for student data privacy.

### 🛡️ Admin Dashboard (`/admin/login`)
- **Real-Time Overview Metrics**: Total Candidates, Completed Exams, In-Progress attempts, Average Score.
- **Live Participants Log**: Real-time progress, time elapsed, and current score status.
- **Question Bank CRUD**: Add, edit, preview, and delete Java snippet questions, code blocks, option choices, and explanations.
- **Configurable Exam Settings**: Toggle candidate answer explanation visibility and customize default exam duration.
- **1-Click CSV Export**: Download complete student scorecards with Name, Email, Student ID, Score, Correct/Incorrect/Unanswered counts, and Time Taken.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Monaco Editor / Prism-style Code Views, Lucide Icons, Canvas Confetti, Axios.
- **Backend**: Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Bcryptjs, Express Rate Limit.
- **Database**: MongoDB (Atlas cloud connection or embedded zero-config in-memory fallback).

---

## 📁 Project Structure

```text
gusac-coding-exam/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/          # Navbar, QuestionNavigator, CodeSnippetViewer, CountdownTimer
│   │   ├── context/             # AuthContext, ExamContext (40-min timer, answer state)
│   │   ├── pages/               # Login, Instructions, ExamPortal, Result, Leaderboard, AdminDashboard
│   │   ├── services/            # Axios API client (auto JWT header attachment)
│   │   ├── App.jsx              # Client routing & authentication guards
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── vercel.json              # SPA routing rewrite rule
├── server/                      # Express.js REST API
│   ├── src/
│   │   ├── config/              # MongoDB connection & 20 Java questions seed
│   │   ├── controllers/         # Auth, Exam, Question, Result, Admin controllers
│   │   ├── middleware/          # JWT auth guard, Admin guard, Rate limiter
│   │   ├── models/              # User, Question, ExamAttempt, Setting
│   │   ├── routes/              # Modular Express API endpoints
│   │   ├── scripts/             # Database seed script (seed.js)
│   │   └── index.js             # Server entry point
│   ├── .env.example
│   ├── package.json
│   └── render.yaml              # Production Render deployment configuration
├── .gitignore                   # Comprehensive gitignore (node_modules, env, dist, logs)
├── package.json                 # Workspace runner scripts
└── README.md
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v9 or newer)
- [MongoDB Atlas](https://www.mongodb.com/atlas) (Recommended) or local MongoDB instance

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

Edit `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gusac_exam?retryWrites=true&w=majority
JWT_SECRET=your_super_secure_jwt_secret_key_2026
EXAM_DURATION_MINUTES=40
```

> **Note on MongoDB**: If `MONGO_URI` is left blank, the server attempts to launch an embedded in-memory MongoDB instance for quick local development. For production or systems with limited temporary disk space, provide a MongoDB Atlas connection string.

Seed the 20 Java questions, default exam settings, admin credentials, and sample leaderboard:
```bash
npm run seed
```

Start the backend:
```bash
npm start
# Server runs on http://localhost:5000
# Health check available at http://localhost:5000/health
```

---

### 3. Frontend Setup

In a separate terminal window:
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

---

## 🔑 Default Credentials

### Administrator Portal
- **Login URL**: `http://localhost:3000/admin/login`
- **Email**: `admin@gusac.org`
- **Password**: `admin123`

### Candidate Flow
- **Candidate URL**: `http://localhost:3000/exam`
- **Registration**: Enter Name, Email, and Student ID (e.g. `Rahul Sharma`, `rahul.s@gitam.in`, `GITAM202401`).

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Student login & token issue |
| `POST` | `/api/admin/login` | Admin authentication |
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/exams/start` | Start 40-minute exam attempt |
| `GET` | `/api/exams/status` | Synchronize server time left & answers |
| `POST` | `/api/exams/save-answer`| Background auto-save response |
| `POST` | `/api/exams/submit` | Finalize exam & grade answers |
| `GET` | `/api/questions` | Fetch 20 Java exam questions (without answers) |
| `GET` | `/api/results/:userId` | Get score `/20` and question breakdown |
| `GET` | `/api/leaderboard` | Get ranked leaderboard |
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

### Step 2: Initialize Git and Commit
```bash
# In the project root (gusac-coding-exam):
git init
git branch -M main
git add .
git commit -m "feat: complete GUSAC 20-question Java coding exam portal MVP"
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
1. Import repository to Vercel.
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
6. Deploy.

---

## 📄 License
Built with ❤️ for **GITAM University Science & Activity Club (GUSAC)**.
