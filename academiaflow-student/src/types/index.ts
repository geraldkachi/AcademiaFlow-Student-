// ─── Auth ───────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}
export interface ForgotPasswordRequest { email: string }
export interface VerifyCodeRequest { email: string; code: string }
export interface ResetPasswordRequest { email: string; code: string; password: string; password_confirmation: string }

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  student_id: string;
  class: string;
  school: { name: string; logo?: string }
  avatar?: string;
}
export interface AuthResponse { token: string; user: AuthUser }

// ─── Dashboard ──────────────────────────────────────────
export interface DashboardStats {
  upcoming_exams: number;
  pending_assignments: number;
  total_subjects: number;
  average_score: number;
  academic_session: string;
}
export interface UpcomingExam {
  id: string; title: string; subject: string;
  date: string; time: string; duration: number;
}
export interface Assignment {
  id: string; title: string; subject: string;
  teacher: string; description: string;
  deadline: string; status: 'active' | 'submitted' | 'graded' | 'not_done';
  attachment?: { name: string; url: string };
  score?: number; feedback?: string;
}
export interface RecentActivity {
  id: string; type: string; title: string; description: string;
  created_at: string; color: string;
}
export interface Notification {
  id: string; title: string; message: string;
  read: boolean; created_at: string;
}

// ─── Exams ──────────────────────────────────────────────
export interface Exam {
  id: string; title: string; subject: string; type: 'online' | 'hall_based';
  date: string; time: string; duration: number;
  total_score: number; instructor: string; submission_date?: string;
  instructions?: string[]; status?: 'upcoming' | 'completed' | 'graded' | 'absent' | 'submitted';
  score?: number;
}
export interface ExamQuestion {
  id: string; number: number; type: 'mcq' | 'true_false';
  text: string; options?: string[]; answer?: string;
}
export interface ExamSession {
  exam_id: string; questions: ExamQuestion[];
  duration: number; total_questions: number;
}
export interface ExamSubmission {
  exam_id: string; answers: Record<string, string>; time_taken: number;
}
export interface ExamSubmittedResult {
  exam_id: string; total_answered: number; not_answered: number; time_taken: string;
}

// ─── Results ────────────────────────────────────────────
export interface ResultSummary {
  exams_taken: number; grade_point_avg: number;
  total_subjects: number; average_score: number; class_rank: number;
}
export interface ResultItem {
  id: string; date: string; exam: string; subject: string; score: string; grade: string; position: string;
}
export interface ResultDetail {
  id: string; title: string; subject: string; class: string;
  date: string; students: number; score: number;
  mcq_questions: ResultQuestion[]; theory_questions: ResultTheoryQuestion[];
  overall_feedback?: string;
}
export interface ResultQuestion {
  number: number; type: string; text: string;
  options?: string[]; correct: string; selected?: string; correct_flag: boolean;
}
export interface ResultTheoryQuestion {
  number: number; marks: number; text: string; answer: string; score: number; feedback: string;
}

// ─── Subjects ───────────────────────────────────────────
export interface Subject {
  id: string; date: string; subject: string; status: 'enrolled'; code?: string; department?: string;
}

// ─── Schedule ───────────────────────────────────────────
export interface ScheduleEvent {
  id: string; title: string; subject: string;
  date: string; start_time: string; end_time: string; type: string;
}

// ─── Settings ───────────────────────────────────────────
export interface UserProfile {
  name: string; email: string; student_id: string; class: string;
  gender: string; dob: string; nationality: string;
  blood_group: string; religion: string; enrolment_date: string;
  phone: string; address: string;
  guardian: { name: string; relationship: string; phone: string; email: string };
}
export interface NotificationSettings {
  new_exam_scheduled: boolean; result_published: boolean;
  new_assignment: boolean; assignment_graded: boolean;
  deadlines_reminder: boolean; deadline_lead_time: string;
  school_announcements: boolean;
}
export interface SecuritySettings {
  current_password: string; new_password: string; confirm_password: string;
}
export interface Preferences {
  language: string; timezone: string; date_format: string; font_size: string;
}

export interface ApiResponse<T> { data: T; message?: string; success: boolean }
export interface PaginatedResponse<T> { data: T[]; total: number; page: number; per_page: number }
