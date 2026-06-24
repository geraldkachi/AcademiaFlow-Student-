import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, BookMarked, CheckCircle, CalendarDays, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

// Mock data for UI while API is not integrated
const mockStats = { upcoming_exams: 4, pending_assignments: 5, total_subjects: 12, average_score: 91, academic_session: '25/26' };
const mockExam = { id: '1', title: 'Mid Term Test', subject: 'Chemistry', date: '20th Jan 2026', time: '9:00AM', duration: 120 };
const mockAssignments = [
  { id: '1', date: '02/02/26', subject: 'Mathematics', deadline: '20/05/25', status: 'graded' },
  { id: '2', date: '16/01/26', subject: 'Economics', deadline: '20/05/25', status: 'submitted' },
  { id: '3', date: '20/05/25', subject: 'Physics', deadline: '20/05/25', status: 'graded' },
  { id: '4', date: '20/05/25', subject: 'Chemistry', deadline: '20/05/25', status: 'not_done' },
  { id: '5', date: '20/05/25', subject: 'Biology', deadline: '20/05/25', status: 'pending' },
];
const mockActivities = [
  { id: '1', title: 'Maths Assignment Graded', description: 'Results are now available', color: 'green', icon: 'check' },
  { id: '2', title: 'Physics Test scheduled', description: 'Test coming up on Friday 20th', color: 'blue', icon: 'circle' },
  { id: '3', title: 'English Exam Graded', description: 'Results are now available', color: 'green', icon: 'check' },
  { id: '4', title: 'Biology Assignment Deadline', description: 'Deadline in 3 hours', color: 'red', icon: 'alert' },
  { id: '5', title: 'New Chemistry Assignment', description: 'Sent today. Deadline is tomorrow', color: 'blue', icon: 'circle' },
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = { graded: 'badge-graded', submitted: 'badge-submitted', pending: 'badge-pending', not_done: 'badge-notdone', active: 'badge-active' };
  return <span className={map[s] || 'badge-pending'}>{s.replace('_', ' ')}</span>;
};

const ActivityIcon = ({ icon }: { color: string; icon: string }) => {
  const cls = `w-6 h-6 shrink-0`;
  if (icon === 'check') return <CheckCircle2 className={`${cls} text-primary`} />;
  if (icon === 'alert') return <AlertCircle className={`${cls} text-red-500`} />;
  return <Circle className={`${cls} text-blue-400`} />;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: stats } = useQuery({ queryKey: ['dashboard-stats'], queryFn: dashboardApi.getStats, placeholderData: mockStats });
  const { data: exam } = useQuery({ queryKey: ['upcoming-exam'], queryFn: dashboardApi.getUpcomingExam, placeholderData: mockExam as any });

  const s = stats || mockStats;
  const e = (exam as any) || mockExam;

  const statCards = [
    { label: 'Upcoming Exams', value: s.upcoming_exams, icon: BookOpen, color: 'text-blue-500' },
    { label: 'Pending Assignments', value: s.pending_assignments, icon: Clock, color: 'text-orange-500' },
    { label: 'Total Subjects', value: s.total_subjects, icon: BookMarked, color: 'text-purple-500' },
    { label: 'Average Score', value: `${s.average_score}%`, icon: CheckCircle, color: 'text-primary' },
    { label: 'Academic Session', value: s.academic_session, icon: CalendarDays, color: 'text-teal-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-lg font-bold text-navy">Hello, {user?.name || 'John Doe'}</h1>
        <p className="text-xs text-gray-400">What do you want to do today?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-3">
            <Icon size={16} className={`${color} mb-2`} />
            <p className="text-lg font-bold text-navy leading-tight">{value}</p>
            <p className="text-[11px] text-gray-400 leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Upcoming Exam */}
        <div className="card p-4 lg:col-span-1">
          <p className="text-xs text-gray-400 font-medium mb-3">Upcoming Exam</p>
          <p className="text-base font-bold text-primary mb-0.5">{e.title}</p>
          <p className="text-xs text-gray-500 mb-3">{e.subject}</p>
          <div className="grid grid-cols-3 gap-2 text-[11px] text-gray-500 mb-4">
            <div><span className="block text-gray-400">📅 Date</span><span className="font-medium text-navy">{e.date}</span></div>
            <div><span className="block text-gray-400">⏰ Time</span><span className="font-medium text-navy">{e.time}</span></div>
            <div><span className="block text-gray-400">⏱ Duration</span><span className="font-medium text-navy">{e.duration} Minutes</span></div>
          </div>
          {/* Calendar illustration */}
          <div className="flex justify-end">
            <div className="w-16 h-16 bg-primary-light rounded-xl flex items-center justify-center">
              <CalendarDays size={28} className="text-primary" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-4 lg:col-span-1">
          <p className="text-xs text-gray-400 font-medium mb-3">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Exams', path: '/exams' },
              { label: 'Assignments', path: '/assignments' },
              { label: 'Results', path: '/results' },
              { label: 'Schedule', path: '/schedules' },
            ].map(({ label, path }) => (
              <button key={label} onClick={() => navigate(path)}
                className="bg-gray-50 hover:bg-primary-light hover:text-primary text-gray-600 rounded-xl py-2.5 text-xs font-semibold transition-colors border border-gray-100">
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card p-4 lg:col-span-1">
          <p className="text-xs text-gray-400 font-medium mb-3">Recent Activities</p>
          <div className="space-y-3">
            {mockActivities.map(a => (
              <div key={a.id} className="flex items-start gap-2.5">
                <ActivityIcon color={a.color} icon={a.icon} />
                <div>
                  <p className="text-xs font-semibold text-navy leading-tight">{a.title}</p>
                  <p className="text-[10px] text-gray-400">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-navy">Assignments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 text-gray-400">
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Subject</th>
              <th className="text-left px-4 py-2.5 font-medium">Deadline</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {mockAssignments.map(a => (
                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-600">{a.date}</td>
                  <td className="px-4 py-2.5 font-medium text-navy">{a.subject}</td>
                  <td className="px-4 py-2.5 text-gray-500">{a.deadline}</td>
                  <td className="px-4 py-2.5">{statusBadge(a.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
