import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyCodePage from './pages/auth/VerifyCodePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import PasswordResetSuccessPage from './pages/auth/PasswordResetSuccessPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ExamsPage from './pages/exams/ExamsPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import ResultsPage from './pages/results/ResultsPage';
import SubjectsPage from './pages/subjects/SubjectsPage';
import SchedulesPage from './pages/schedules/SchedulesPage';
import SettingsPage from './pages/settings/SettingsPage';

const qc = new QueryClient({ defaultOptions: { queries: { retry: 1, staleTime: 5 * 60 * 1000 } } });

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/verify-code" element={<VerifyCodePage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/password-reset-success" element={<PasswordResetSuccessPage />} />

            {/* Protected */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/exams" element={<ExamsPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/schedules" element={<SchedulesPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
