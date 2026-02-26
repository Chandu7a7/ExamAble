# VI-Exam Portal (Visually Impaired Exam Portal)

An accessible, voice-integrated, and highly secure online examination system designed specifically for visually impaired (VI) students. The platform leverages modern web technologies, AI-powered image descriptions, and the Web Speech API to provide an equitable and independent testing environment.

## 🌟 Key Features

### 🎧 Inclusive & Voice-First Student Experience
- **Voice Assistant Integration**: Automatically reads out questions, options, and critical alerts using `window.speechSynthesis`.
- **Dynamic Exam Timer**: Fetches the duration directly from the backend to initialize the countdown. Automatically announces total time and remaining questions at calculated dynamic intervals.
- **Auto-Submission**: Includes voice warnings at the 1-minute mark and auto-submits the exam when the timer hits zero.
- **Accessibility Alerts**: Gives a prominent "ACCESSIBILITY ALERT" and deep text transcription whenever an image-based question appears.
- **Voice Navigation**: Students can select options by speaking "Option 1", "Two", "Next", "Previous", "Submit", or "Repeat Question".
- **Keyboard Shortcuts**: Full keyboard navigability (1-4 for options, N for Next, P for Previous, R for Repeat, S for Submit, M for Mark for Review).

### 🛡️ Secure Proctoring & Mechanics
- **Tab Switch Detection**: Monitors away-time to prevent unauthorized browsing during the exam (using visibility API).
- **Immersive Fullscreen Penalty**: Forces the student to take the exam in fullscreen. If they exit, warnings are issued.
- **Safe Zone Restorations**: Navigating back from the submit confirmation page automatically requests fullscreen mode again.

### 🧠 AI-Powered Admin & Question Bank
- **Visual Asset Uploads**: Admins can seamlessly add images to questions.
- **Automated Accessibility Generation**: Uses the **Google Gemini 1.5 Flash API** to auto-generate objective, pedagogically neutral text descriptions for uploaded images, ensuring clinical-grade accessibility without revealing answers.
- **Strict Validation**: The database strictly requires an `accessibilityText` whenever an image is provided.
- **Question Composition**: Multi-functional question bank allowing divergence choices (MCQ) or custom inputs.

## 💻 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router, Web Speech API (SpeechRecognition & SpeechSynthesis).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Storage**: Multer for local image processing.
- **AI Integration**: `@google/generative-ai` (Gemini API).

## � Folder Structure

```text
vi-exam-portal/
├── client/                 # Frontend React application (Vite)
│   ├── public/             
│   ├── src/                
│   │   ├── components/     # Reusable UI components (e.g., AdminSidebar, ProtectedRoute)
│   │   ├── hooks/          # Custom React hooks (e.g., useTabSwitchDetection)
│   │   ├── pages/          # Main application pages
│   │   │   ├── admin/      # Admin interfaces (CreateExam, QuestionBank, etc.)
│   │   │   ├── ExamPage.jsx
│   │   │   ├── ConfirmSubmit.jsx
│   │   │   └── ...
│   │   ├── App.jsx         # Main routing and layout wrapper
│   │   └── main.jsx        # React DOM rendering entry point
│   ├── package.json        
│   └── tailwind.config.js  
├── server/                 # Backend Node.js/Express application
│   ├── config/             # Configuration files (e.g., Database connection)
│   ├── controllers/        # Core business logic handlers (aiController, examController, etc.)
│   ├── middleware/         # Express middleware (authMiddleware, roleMiddleware, errorMiddleware)
│   ├── models/             # Mongoose database schemas (Exam, Question, User)
│   ├── routes/             # API endpoint definitions
│   ├── uploads/            # Local storage directory for visual assets
│   ├── utils/              # Helper utilities (e.g., aiUtils.js for Gemini integration)
│   ├── server.js           # Main Express server entry point
│   ├── debug_models.js     # Standalone scripts for debugging
│   └── package.json        
└── README.md               # Project documentation
```

## 🚀 Quick Start
### 1. Prerequisites
- Node.js (v16+)
- MongoDB connection string
- Google Gemini API Key

### 2. Environment Variables

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Installation

**Setup Backend:**
```bash
cd server
npm install
npm run dev
```

**Setup Frontend:**
```bash
cd client
npm install
npm run dev
```

## 🛠️ Usage Flows

**Admin Capabilities:**
1. Navigate to `/admin/dashboard` to manage the system.
2. Go to **Question Bank** to create questions. If you upload an image, click **AI Suggest** to auto-generate accessibility text.
3. Construct exams from the question bank. Define the time duration and total points dynamically.

**Student Capabilities:**
1. Access the exam link.
2. Grant microphone permissions for voice commands.
3. The Voice Assistant will begin reading. Navigate using Voice, Keyboard Shortcuts, or Mouse/Touch.
4. Auto-submit logic handles transitions smoothly upon completion of the timer.

## 🤝 Designing for Accessibility
This app was built with a strict "Visual Context First" protocol. Every update adheres strictly to WCAG principles, making sure the UI logic explicitly prioritizes reading alt-text and descriptors *before* reading the question text to provide students with the foundational context needed to succeed.



Team @Alpha7
