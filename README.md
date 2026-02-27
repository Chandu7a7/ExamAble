<div align="center">

# 🎓 ExamAble

### *Accessible Examination Portal for Visually Impaired Students*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-examable.vercel.app-6366f1?style=for-the-badge&logoColor=white)](https://examable.vercel.app)
[![Backend](https://img.shields.io/badge/Backend-examable.onrender.com-10b981?style=for-the-badge)](https://examable.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)](LICENSE)
[![Hackathon](https://img.shields.io/badge/Symbiosis_Hackathon-2026-ec4899?style=for-the-badge)](https://github.com/Chandu7a7/ExamAble)

<br/>

> **ExamAble** is a voice-first, AI-powered, and fully accessible online examination system built for visually impaired (VI) students. It combines the Web Speech API, Google Gemini AI, and an inclusive UI to provide a truly independent and equitable testing experience.

<br/>

## 🎥 Project Demo

[![Watch Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/0.jpg)]
(https://www.youtube.com/watch?v=YOUR_VIDEO_ID)


[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite_5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev)
[![Vercel](https://img.shields.io/badge/Vercel-000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white)](https://render.com)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Environment Variables](#️-environment-variables)
- [📁 Project Structure](#-project-structure)
- [🎤 Voice Commands](#-voice-commands)
- [🌐 Deployment](#-deployment)
- [👥 Team](#-team)

---

## ✨ Features

### 🎧 Voice-First Student Experience
- **🔊 Auto-Narration** — Questions, options, and alerts are automatically read aloud using the Web Speech API
- **🎤 Voice Commands** — Navigate and answer entirely by voice: *"Option Two"*, *"Next"*, *"Previous"*, *"Submit"*, *"Repeat Question"*
- **⏱️ Smart Timer Announcements** — Dynamic audio alerts at calculated intervals and a final 1-minute warning
- **🖼️ Image Accessibility** — Every visual question has an AI-generated audio description so students know *what* the image shows without getting hints

### 🛡️ Proctoring & Security
- **👁️ Tab Switch Detection** — Logs and penalizes any tab switching or window blur during the exam
- **📺 Fullscreen Enforcement** — Exam runs in mandatory fullscreen; exiting triggers warnings
- **⏰ Auto-Submit** — Timer expiry automatically submits the exam, preventing incomplete sessions
- **🔒 JWT Auth** — Role-based access control with secure token authentication (student / admin)

### 🧠 AI-Powered Admin Tools
- **📸 Cloudinary Image Upload** — Production-safe image storage; URLs stored directly in MongoDB
- **🤖 Gemini AI Description** — One-click AI generation of neutral, pedagogically safe accessibility text for images
- **📝 Question Bank** — Full CRUD for questions with subject, difficulty, options, and image support
- **📊 Exam Builder** — Create timed exams from the question bank with dynamic configuration
- **📈 Analytics Dashboard** — Real-time stats on users, exams, and results

### ♿ Accessibility-First Design
- **WCAG 2.1 AAA** compliant design principles throughout
- **Keyboard Navigation** — Every action is reachable without a mouse
- **ARIA Live Regions** — Screen-reader compatible announcements for every state change
- **High Contrast** — Dark mode and high-contrast toggle support

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Vercel)                         │
│                    React 18 + Vite + TailwindCSS                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │   ExamPage   │  │  AdminPanel  │  │  Dashboard / Results  │ │
│  │ + Voice API  │  │ + QuestionBank│  │  + Analytics         │ │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘ │
└─────────┼─────────────────┼───────────────────────────────────┘
          │  HTTPS + JSON   │
          ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       SERVER (Render)                           │
│                    Node.js + Express.js                         │
│                                                                 │
│  /api/auth   /api/exams   /api/questions   /api/results        │
│  /api/upload /api/ai      /api/violations  /api/admin          │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────────────┐ │
│  │  Multer  │  │  Gemini AI   │  │  JWT + Role Middleware    │ │
│  │ (memory) │  │  (describe)  │  │  protect + requireRole   │ │
│  └────┬─────┘  └──────────────┘  └──────────────────────────┘ │
└───────┼─────────────────────────────────────────────────────────┘
        │
        ├──────────────────────────────────┐
        ▼                                  ▼
┌───────────────┐                ┌─────────────────┐
│  MongoDB Atlas│                │   Cloudinary    │
│  (data store) │                │ (image storage) │
└───────────────┘                └─────────────────┘
```

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, TailwindCSS, React Router v6 |
| **HTTP Client** | Native `fetch` API |
| **Voice** | Web Speech API (`SpeechRecognition` + `SpeechSynthesis`) |
| **Backend** | Node.js, Express.js (ESM modules) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JSON Web Tokens (JWT) |
| **Image Storage** | Cloudinary (upload via stream, permanent CDN URLs) |
| **AI** | Google Gemini 1.5 Flash (`@google/generative-ai`) |
| **File Handling** | Multer (memory storage → Cloudinary) |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |

---

## 🚀 Quick Start

### Prerequisites
- Node.js **v18+**
- MongoDB Atlas account (free tier works)
- Google [Gemini API Key](https://ai.google.dev)
- [Cloudinary](https://cloudinary.com) account (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/Chandu7a7/ExamAble.git
cd ExamAble
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create `server/.env` (see [Environment Variables](#️-environment-variables)):

```bash
cp .env.example .env
# Then fill in your actual values
```

```bash
npm run dev     # Starts on http://localhost:5000
```

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev     # Starts on http://localhost:5173
```

---

## ⚙️ Environment Variables

### `server/.env`

```env
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/examable

# Auth
JWT_SECRET=use_a_long_random_secure_string_here

# Server
PORT=5000

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Cloudinary (image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL (for CORS — set to your Vercel URL in production)
CLIENT_ORIGIN=http://localhost:5173
```

### `client/.env`

```env
# Points to your backend (Render URL in production)
VITE_API_URL=https://examable.onrender.com
```

---

## 📁 Project Structure

```
ExamAble/
├── client/                         # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api.js                  # 🔑 Central API base URL config
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminSidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── hooks/
│   │   │   ├── useTabSwitchDetection.js
│   │   │   ├── useVoiceCommands.js
│   │   │   ├── useSpeechSynthesis.js
│   │   │   └── useKeyboardShortcuts.js
│   │   └── pages/
│   │       ├── admin/
│   │       │   ├── AdminDashboard.jsx
│   │       │   ├── Analytics.jsx
│   │       │   ├── CreateExam.jsx
│   │       │   ├── ManageExams.jsx
│   │       │   └── QuestionBank.jsx
│   │       ├── ExamPage.jsx        # 🎯 Core exam interface + voice
│   │       ├── ExamInstructions.jsx
│   │       ├── ConfirmSubmit.jsx
│   │       ├── Result.jsx
│   │       ├── StudentDashboard.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── Profile.jsx
│   │       └── Landing.jsx
│   ├── .env
│   ├── vercel.json                 # SPA routing config for Vercel
│   └── package.json
│
├── server/                         # Express backend
│   ├── config/
│   │   └── db.js                   # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js
│   │   ├── authController.js
│   │   ├── examController.js
│   │   ├── questionController.js
│   │   └── resultController.js
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   ├── roleMiddleware.js       # Admin/student gates
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── examRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── resultRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   └── violationRoutes.js
│   ├── utils/
│   │   └── aiUtils.js              # Gemini image description
│   ├── .env
│   ├── .env.example
│   └── server.js                  # Main Express entry point
│
├── render.yaml                    # Render deployment blueprint
└── README.md
```

---

## 🎤 Voice Commands

Students can control the entire exam by voice:

| Command | Action |
|---|---|
| `"Option One"` / `"One"` | Select option A |
| `"Option Two"` / `"Two"` | Select option B |
| `"Option Three"` / `"Three"` | Select option C |
| `"Option Four"` / `"Four"` | Select option D |
| `"Next"` / `"Next Question"` | Go to next question |
| `"Previous"` / `"Back"` | Go to previous question |
| `"Repeat"` / `"Read"` / `"Again"` | Re-read current question |
| `"Submit"` / `"Finish"` | Initiate exam submission |
| `"Mark"` | Flag question for review |

> 💡 Voice assistant automatically reads each question when navigated to — no commands needed to start listening.

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| **Frontend** | Vercel | [examable.vercel.app](https://examable.vercel.app) |
| **Backend** | Render | [examable.onrender.com](https://examable.onrender.com) |
| **Database** | MongoDB Atlas | — |
| **Images** | Cloudinary CDN | `res.cloudinary.com/...` |

### Deploy Your Own

**Backend → Render:**
1. Connect GitHub repo → New Web Service
2. Root Directory: `server` | Build: `npm install` | Start: `npm start`
3. Add all env variables from `server/.env.example`

**Frontend → Vercel:**
1. Connect GitHub repo → New Project
2. Root Directory: `client` | Framework: Vite
3. Add env variable: `VITE_API_URL=https://your-render-url.onrender.com`

---

## 👥 Team

<div align="center">

Built with ❤️ by **Team Alpha7** at Symbiosis Hackathon 2026

 

</div>

---

<div align="center">

**ExamAble** — *Because every student deserves an equal opportunity to succeed.*

⭐ Star this repo if you found it useful!

</div>
