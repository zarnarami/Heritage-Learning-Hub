import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ExploreHeritagePage from './pages/ExploreHeritagePage';
import HeritageDetailsPage from './pages/HeritageDetailsPage';
import LearningResourcesPage from './pages/LearningResourcesPage';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Routes>
      {/* Public Pages with Main Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/explore" element={<ExploreHeritagePage />} />
        <Route path="/heritage/:id" element={<HeritageDetailsPage />} />
        <Route path="/learning" element={<LearningResourcesPage />} />
        <Route path="/quizzes" element={<QuizPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Student Dashboard */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student', 'teacher', 'admin']}>
            <DashboardLayout roleTitle="Student Scholar" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentDashboard />} />
      </Route>

      {/* Protected Teacher Dashboard */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <DashboardLayout roleTitle="Educator Portal" />
          </ProtectedRoute>
        }
      >
        <Route index element={<TeacherDashboard />} />
      </Route>

      {/* Protected Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout roleTitle="Administration Portal" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
