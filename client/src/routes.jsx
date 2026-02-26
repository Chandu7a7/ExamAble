import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ExamInstructions from "./pages/ExamInstructions.jsx";
import ExamPage from "./pages/ExamPage.jsx";
import Result from "./pages/Result.jsx";
import ConfirmSubmit from "./pages/ConfirmSubmit.jsx";
import Profile from "./pages/Profile.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import CreateExam from "./pages/admin/CreateExam.jsx";
import ManageExams from "./pages/admin/ManageExams.jsx";
import Analytics from "./pages/admin/Analytics.jsx";
import QuestionBank from "./pages/admin/QuestionBank.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <StudentDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      }
    />
    <Route
      path="/exam/instructions"
      element={
        <ProtectedRoute>
          <ExamInstructions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/exam"
      element={
        <ProtectedRoute>
          <ExamPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/exam/confirm-submit"
      element={
        <ProtectedRoute>
          <ConfirmSubmit />
        </ProtectedRoute>
      }
    />
    <Route
      path="/result"
      element={
        <ProtectedRoute>
          <Result />
        </ProtectedRoute>
      }
    />

    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/create-exam"
      element={
        <ProtectedRoute>
          <CreateExam />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/manage-exams"
      element={
        <ProtectedRoute>
          <ManageExams />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/analytics"
      element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/question-bank"
      element={
        <ProtectedRoute>
          <QuestionBank />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;

