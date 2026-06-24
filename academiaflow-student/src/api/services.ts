import apiClient from './client';
import type {
  LoginRequest, ForgotPasswordRequest, VerifyCodeRequest, ResetPasswordRequest,
  AuthResponse, DashboardStats, UpcomingExam, RecentActivity, Notification,
  Exam, ExamSession, ExamSubmission, ExamSubmittedResult,
  Assignment, ResultSummary, ResultItem, ResultDetail,
  Subject, ScheduleEvent, UserProfile, NotificationSettings, SecuritySettings, Preferences,
} from '../types';

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then(r => r.data),
  forgotPassword: (data: ForgotPasswordRequest) =>
    apiClient.post('/auth/forgot-password', data).then(r => r.data),
  verifyCode: (data: VerifyCodeRequest) =>
    apiClient.post('/auth/verify-code', data).then(r => r.data),
  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post('/auth/reset-password', data).then(r => r.data),
  logout: () => apiClient.post('/auth/logout').then(r => r.data),
  me: () => apiClient.get<AuthResponse['user']>('/auth/me').then(r => r.data),
};

// ─── Dashboard ──────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => apiClient.get<DashboardStats>('/student/dashboard/stats').then(r => r.data),
  getUpcomingExam: () => apiClient.get<UpcomingExam>('/student/dashboard/upcoming-exam').then(r => r.data),
  getAssignments: () => apiClient.get<import('../types').Assignment[]>('/student/dashboard/assignments').then(r => r.data),
  getRecentActivities: () => apiClient.get<RecentActivity[]>('/student/dashboard/activities').then(r => r.data),
  getNotifications: () => apiClient.get<Notification[]>('/student/notifications').then(r => r.data),
  markNotificationRead: (id: string) => apiClient.patch(`/student/notifications/${id}/read`).then(r => r.data),
};

// ─── Exams ──────────────────────────────────────────────────────────────────
export const examsApi = {
  getAll: () => apiClient.get<{ ongoing: Exam; upcoming: Exam[]; completed: Exam[] }>('/student/exams').then(r => r.data),
  getById: (id: string) => apiClient.get<Exam>(`/student/exams/${id}`).then(r => r.data),
  startExam: (id: string) => apiClient.post<ExamSession>(`/student/exams/${id}/start`).then(r => r.data),
  submitExam: (data: ExamSubmission) => apiClient.post<ExamSubmittedResult>('/student/exams/submit', data).then(r => r.data),
  endExam: (id: string) => apiClient.post(`/student/exams/${id}/end`).then(r => r.data),
};

// ─── Assignments ────────────────────────────────────────────────────────────
export const assignmentsApi = {
  getAll: (filters?: { status?: string; month?: string }) =>
    apiClient.get<Assignment[]>('/student/assignments', { params: filters }).then(r => r.data),
  getById: (id: string) => apiClient.get<Assignment>(`/student/assignments/${id}`).then(r => r.data),
  submit: (id: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return apiClient.post(`/student/assignments/${id}/submit`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  },
};

// ─── Results ────────────────────────────────────────────────────────────────
export const resultsApi = {
  getSummary: () => apiClient.get<ResultSummary>('/student/results/summary').then(r => r.data),
  getAll: (term?: string) => apiClient.get<ResultItem[]>('/student/results', { params: { term } }).then(r => r.data),
  getById: (id: string) => apiClient.get<ResultDetail>(`/student/results/${id}`).then(r => r.data),
};

// ─── Subjects ───────────────────────────────────────────────────────────────
export const subjectsApi = {
  getAll: () => apiClient.get<Subject[]>('/student/subjects').then(r => r.data),
  addSubject: (data: { subject: string; code: string; department: string }) =>
    apiClient.post('/student/subjects', data).then(r => r.data),
  deleteSubject: (id: string) => apiClient.delete(`/student/subjects/${id}`).then(r => r.data),
};

// ─── Schedule ───────────────────────────────────────────────────────────────
export const scheduleApi = {
  getEvents: (month?: string, week?: number) =>
    apiClient.get<ScheduleEvent[]>('/student/schedule', { params: { month, week } }).then(r => r.data),
};

// ─── Settings ───────────────────────────────────────────────────────────────
export const settingsApi = {
  getProfile: () => apiClient.get<UserProfile>('/student/settings/profile').then(r => r.data),
  getNotifications: () => apiClient.get<NotificationSettings>('/student/settings/notifications').then(r => r.data),
  updateNotifications: (data: NotificationSettings) =>
    apiClient.put('/student/settings/notifications', data).then(r => r.data),
  updatePassword: (data: SecuritySettings) =>
    apiClient.put('/student/settings/security', data).then(r => r.data),
  getPreferences: () => apiClient.get<Preferences>('/student/settings/preferences').then(r => r.data),
  updatePreferences: (data: Preferences) =>
    apiClient.put('/student/settings/preferences', data).then(r => r.data),
};
