import { Calendar, Clock, Timer } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { examsApi } from '../../api/services';
import type { Exam } from '../../types';

// Mock session for UI before API integration
const mockSession = {
  exam_id: '1', duration: 3600, total_questions: 12,
  questions: Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1), number: i + 1, type: 'mcq' as const,
    text: i === 0
      ? 'If θ = 0.6, what is the value of θ in degrees: 3² + 8 × 90°?'
      : `What is the value of √(n) to 2 decimal places? (Question ${i + 1})`,
    options: ['A. 35', 'A. 23', 'A. 38', 'A. 35'],
  })),
};

interface Props { exam: Exam; onCancel: () => void; onStart: (session: any) => void }

export default function ExamStartModal({ exam, onCancel, onStart }: Props) {
  const { mutate, isPending } = useMutation({
    mutationFn: () => examsApi.startExam(exam.id),
    onSuccess: (session) => onStart(session),
    onError: () => onStart(mockSession), // Fallback to mock while API not ready
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-modal overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold text-navy">{exam.title}</h3>
            <span className="badge-online">{exam.type === 'online' ? 'Online' : 'Hall Based'}</span>
          </div>
          <p className="text-xs text-primary font-medium">{exam.subject}</p>
          <div className="grid grid-cols-3 gap-3 mt-3 text-[11px] text-gray-500">
            <div className="flex items-center gap-1"><Calendar size={10} /><div><span className="block text-gray-400">Date</span><span className="font-medium text-navy">{exam.date}</span></div></div>
            <div className="flex items-center gap-1"><Clock size={10} /><div><span className="block text-gray-400">Time</span><span className="font-medium text-navy">{exam.time}</span></div></div>
            <div className="flex items-center gap-1"><Timer size={10} /><div><span className="block text-gray-400">Duration</span><span className="font-medium text-navy">{exam.duration} Min</span></div></div>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-5 space-y-3">
          <div className="bg-primary-light rounded-xl p-3">
            <p className="text-xs font-semibold text-navy mb-2">Exam Instructions</p>
            <ul className="space-y-1 text-[11px] text-gray-600">
              {[
                'Duration: 2 hours (120 minutes)',
                'Total Questions: 10',
                'All questions are mandatory',
                'You cannot pause or exit once the exam starts',
                'The exam will auto-submit when time expires',
                'Make sure you have a stable internet connection',
                'Do not switch tabs or minimize the browser',
              ].map(i => <li key={i} className="flex items-start gap-1.5"><span className="text-primary mt-0.5">•</span>{i}</li>)}
            </ul>
          </div>

          <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
            <p className="text-xs font-semibold text-navy mb-2">Before you Begin</p>
            <ul className="space-y-1 text-[11px] text-gray-600">
              {['Ensure you have a stable internet connection', 'Close all other applications and browser tabs', 'Have your ID card ready if needed', 'Find a quiet place to take the exam'].map(i => (
                <li key={i} className="flex items-start gap-1.5"><span className="text-orange-400 mt-0.5">•</span>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button onClick={onCancel} className="btn-outline flex-1">Cancel</button>
          <button onClick={() => mutate()} disabled={isPending} className="btn-primary flex-1">
            {isPending ? 'Loading…' : 'Start Exam'}
          </button>
        </div>
      </div>
    </div>
  );
}
