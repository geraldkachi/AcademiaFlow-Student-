import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Calendar, Clock, Timer, Hash, User } from 'lucide-react';
import { examsApi } from '../../api/services';
import ExamStartModal from './ExamStartModal';
import ExamTaking from './ExamTaking';

const mockExams = {
  ongoing: { id: '1', title: 'Mid Term Test', subject: 'Chemistry', type: 'online' as const, date: '20th Jan 2026', time: '9:00AM', duration: 120, total_score: 40, instructor: 'Mr Wishbone', submission_date: 'October 31, 2023' },
  upcoming: [
    { id: '2', title: 'Pop Quiz', subject: 'Biology', type: 'hall_based' as const, date: '30th Jan 2026', time: '9:00AM', duration: 30 },
    { id: '3', title: 'Mid Term Test', subject: 'Mathematics', type: 'hall_based' as const, date: '30th Jan 2026', time: '9:00AM', duration: 60 },
  ],
  completed: [
    { id: '4', title: 'Mid Term Test', subject: 'Mathematics', status: 'graded' as const, score: 40 },
    { id: '5', title: 'Third Term Exam', subject: 'Economics', status: 'submitted' as const },
    { id: '6', title: 'Pop Quiz', subject: 'Physics', status: 'graded' as const },
    { id: '7', title: 'Mid Term Test', subject: 'Chemistry', status: 'absent' as const },
    { id: '8', title: 'First Term Exam', subject: 'Biology', status: 'pending' as const },
  ],
};

const statusBadge = (s: string) => {
  const map: Record<string, string> = { graded: 'badge-graded', submitted: 'badge-submitted', pending: 'badge-pending', absent: 'badge-absent', online: 'badge-online', hall_based: 'badge-hallbased' };
  const labels: Record<string, string> = { graded: 'Graded', submitted: 'Submitted', pending: 'Pending', absent: 'Absent', online: 'Online', hall_based: 'Hall Based' };
  return <span className={map[s] || 'badge-pending'}>{labels[s] || s}</span>;
};

export default function ExamsPage() {
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [examSession, setExamSession] = useState<any>(null);
  const [calMonth] = useState('January 2026');

  const { data } = useQuery({ queryKey: ['exams'], queryFn: examsApi.getAll, placeholderData: mockExams as any });
  const exams = (data as any) || mockExams;

  if (examSession) return <ExamTaking session={examSession} exam={selectedExam} onEnd={() => { setExamSession(null); setSelectedExam(null); }} />;

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-navy">Exams</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Ongoing */}
          <div className="card p-4">
            <p className="text-[11px] text-gray-400 font-medium mb-3">Ongoing Exam</p>
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-navy">{exams.ongoing.title}</h3>
                  {statusBadge(exams.ongoing.type)}
                </div>
                <p className="text-xs text-primary font-medium">{exams.ongoing.subject}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] mb-4">
              <div className="flex items-center gap-1.5 text-gray-500"><Calendar size={12} /><div><span className="block text-gray-400">Date</span><span className="font-medium text-navy">{exams.ongoing.date}</span></div></div>
              <div className="flex items-center gap-1.5 text-gray-500"><Clock size={12} /><div><span className="block text-gray-400">Time</span><span className="font-medium text-navy">{exams.ongoing.time}</span></div></div>
              <div className="flex items-center gap-1.5 text-gray-500"><Hash size={12} /><div><span className="block text-gray-400">Total Score</span><span className="font-medium text-navy">{exams.ongoing.total_score} Marks</span></div></div>
              <div className="flex items-center gap-1.5 text-gray-500"><User size={12} /><div><span className="block text-gray-400">Instructor</span><span className="font-medium text-navy">{exams.ongoing.instructor}</span></div></div>
            </div>
            <button onClick={() => setSelectedExam(exams.ongoing)} className="btn-primary w-full sm:w-auto">Start Exam</button>
          </div>

          {/* Upcoming */}
          <div>
            <h3 className="text-sm font-bold text-navy mb-3">Upcoming Exams</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {exams.upcoming.map((ex: any) => (
                <div key={ex.id} className="card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-navy">{ex.title}</span>
                    {statusBadge(ex.type)}
                  </div>
                  <p className="text-xs text-primary font-medium mb-2">{ex.subject}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><Calendar size={10} />{ex.date}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{ex.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-3">
                    <Timer size={10} />{ex.duration} Mins
                  </div>
                  <button onClick={() => setSelectedExam(ex)} className="text-primary text-xs font-semibold hover:underline">View Details</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mini calendar */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft size={14} /></button>
              <span className="text-xs font-semibold text-navy">{calMonth}</span>
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight size={14} /></button>
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-gray-400 mb-1">
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <span key={d}>{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-0.5 text-[11px] text-center">
              {[30,31,...Array.from({length:31},(_,i)=>i+1),1,2].map((d,i) => (
                <span key={i} className={`py-1 rounded-full ${d === 20 ? 'bg-primary text-white font-bold' : ''} ${[21,25,28].includes(d) && i > 1 ? 'text-primary font-semibold' : 'text-gray-600'} ${(i < 2 || i > 32) ? 'text-gray-300' : ''}`}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Completed exams */}
          <div className="card overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm font-bold text-navy">Completed Exams</span>
              <select className="text-xs text-gray-500 border-none outline-none bg-transparent"><option>January</option></select>
            </div>
            <table className="w-full text-xs">
              <thead><tr className="border-b border-gray-50 text-gray-400">
                <th className="text-left px-4 py-2 font-medium">Title</th>
                <th className="text-left px-4 py-2 font-medium">Subject</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {exams.completed.map((ex: any) => (
                  <tr key={ex.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-2 text-navy font-medium">{ex.title}</td>
                    <td className="px-4 py-2 text-gray-500">{ex.subject}</td>
                    <td className="px-4 py-2">{statusBadge(ex.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Start exam modal */}
      {selectedExam && !examSession && (
        <ExamStartModal
          exam={selectedExam}
          onCancel={() => setSelectedExam(null)}
          onStart={(session) => setExamSession(session)}
        />
      )}
    </div>
  );
}
