import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Eye, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { resultsApi } from '../../api/services';

const mockSummary = { exams_taken: 12, grade_point_avg: 3.5, total_subjects: 12, average_score: 91, class_rank: 2 };
const mockResults = [
  { id: '1', date: '02/02/26', exam: 'Mid Term Test', subject: 'Mathematics', score: '40/40', grade: 'A', position: '1st' },
  { id: '2', date: '16/01/28', exam: 'Pop Quiz', subject: 'Economics', score: '16/20', grade: 'B', position: '3rd' },
  { id: '3', date: '20/05/25', exam: 'Mid Term Test', subject: 'Physics', score: '38/100', grade: 'A', position: '2nd' },
  { id: '4', date: '20/05/25', exam: 'Mock Exams', subject: 'Chemistry', score: '92/100', grade: 'A', position: '1st' },
  { id: '5', date: '20/05/25', exam: 'Third Term Exam', subject: 'Biology', score: '68/100', grade: 'B', position: '5th' },
];

const mockDetail = {
  id: '1', title: 'Mathematics Finals', subject: 'Mathematics', class: 'SS1A',
  date: 'Feb 6, 2026', students: 42, score: 100,
  mcq_questions: [
    { number: 1, type: 'MCQ', text: "Which of the following is Newton's Second Law of Motion?", options: ['An object at rest stays at rest unless acted upon by an external force', 'F = ma (Force equals mass times acceleration)', 'For every action, there is an equal and opposite reaction', 'Energy cannot be created or destroyed'], correct: 'B', selected: 'B', correct_flag: true },
    { number: 2, type: 'MCQ', text: 'What is the SI unit of electric current?', options: ['Volt', 'Watt', 'Ampere', 'Ohm'], correct: 'C', selected: 'C', correct_flag: true },
    { number: 3, type: 'True/False', text: 'What is the SI unit of electric current?', options: ['True', 'False'], correct: 'True', selected: 'True', correct_flag: true },
  ],
  theory_questions: [
    { number: 1, marks: 15, text: 'Explain the theory of relativity', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'Try more next time' },
    { number: 2, marks: 15, text: 'Explain the usefulness of time', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was easy me' },
    { number: 3, marks: 15, text: 'If a man were to jump as high as 50m/s what is the amount energy needed for take off', answer: 'Space and time are relative and interconnected.', score: 10, feedback: 'This was heavy me' },
  ],
  overall_feedback: 'Space and time are relative and interconnected.',
};

export default function ResultsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: summary } = useQuery({ queryKey: ['results-summary'], queryFn: resultsApi.getSummary, placeholderData: mockSummary });
  const { data: results = [] } = useQuery({ queryKey: ['results'], queryFn: () => resultsApi.getAll(), placeholderData: mockResults as any });

  const detail = mockDetail; // Would be fetched: resultsApi.getById(selectedId)

  const s = summary || mockSummary;
  const r = (results as any[]).length ? results : mockResults;

  if (selectedId) {
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedId(null)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-navy transition-colors">
          <ArrowLeft size={14} /> Results / View Results
        </button>
        <div className="card p-4">
          <h2 className="font-bold text-navy text-base mb-0.5">{detail.title}</h2>
          <p className="text-xs text-gray-400 mb-3">{detail.class} • {detail.date} • {detail.students} students</p>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-semibold">JD</div>
            <div>
              <p className="text-xs font-semibold text-navy">John Doe</p>
              <p className="text-[10px] text-gray-400">MCQ · M3 · Theory: 0/90</p>
            </div>
            <span className="ml-auto text-2xl font-bold text-navy">D</span>
            <span className="font-bold text-primary">{detail.score}/100</span>
          </div>

          {/* MCQ */}
          <h3 className="font-bold text-navy text-sm mb-3">Multi-Choice Questions</h3>
          <div className="space-y-4 mb-6">
            {detail.mcq_questions.map(q => (
              <div key={q.number} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-white bg-navy px-2 py-0.5 rounded">{q.number}</span>
                  <span className="badge-submitted text-[10px]">{q.type}</span>
                  <span className="badge-graded text-[10px]">M</span>
                </div>
                <p className="text-xs text-navy mb-3">{q.text}</p>
                {q.options && <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((o, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isCorrect = letter === q.correct;
                    const isSelected = letter === q.selected;
                    return (
                      <div key={i} className={`flex items-center gap-2 p-2.5 rounded-lg text-xs border ${isCorrect ? 'bg-primary-light border-primary/30 text-primary' : isSelected && !isCorrect ? 'bg-red-50 border-red-200 text-red-600' : 'border-gray-100 text-gray-600'}`}>
                        {isCorrect ? <CheckCircle2 size={12} className="text-primary shrink-0" /> : isSelected ? <XCircle size={12} className="text-red-500 shrink-0" /> : <div className="w-3 h-3 border border-gray-200 rounded-full shrink-0" />}
                        {o}
                      </div>
                    );
                  })}
                </div>}
              </div>
            ))}
          </div>

          {/* Theory */}
          <h3 className="font-bold text-navy text-sm mb-3">Theory Section</h3>
          <div className="space-y-4">
            {detail.theory_questions.map(q => (
              <div key={q.number} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold text-white bg-navy px-2 py-0.5 rounded">{q.number}</span>
                  <span className="badge-graded text-[10px]">Essay</span>
                  <span className="badge-pending text-[10px]">{q.marks} Marks</span>
                </div>
                <p className="text-xs text-navy mb-3">{q.text}</p>
                <p className="text-[11px] text-gray-400 mb-1">Answer</p>
                <div className="bg-gray-50 rounded-lg p-2.5 text-xs text-gray-600 mb-3">{q.answer}</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-gray-400 text-[10px] mb-0.5">Score / 15</p><p className="font-bold text-navy">{q.score}</p></div>
                  <div><p className="text-gray-400 text-[10px] mb-0.5">Feedback</p><p className="text-gray-600">{q.feedback}</p></div>
                </div>
              </div>
            ))}
          </div>

          {detail.overall_feedback && (
            <div className="mt-5 border-t border-gray-100 pt-4">
              <p className="text-xs font-semibold text-navy mb-1">Overall Feedback for Student</p>
              <p className="text-xs text-gray-500">{detail.overall_feedback}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-lg font-bold text-navy">Results</h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Exam Taken', value: s.exams_taken },
          { label: 'Grade Point Avg', value: s.grade_point_avg },
          { label: 'Total Subjects', value: s.total_subjects },
          { label: 'Average Score', value: `${s.average_score}%` },
          { label: 'Class Rank', value: `${s.class_rank}nd` },
        ].map(({ label, value }) => (
          <div key={label} className="card p-3 text-center">
            <p className="text-base font-bold text-primary">{value}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Results table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-wrap gap-2">
          <span className="text-sm font-bold text-navy">Recent Results</span>
          <select className="input-field py-1 w-auto text-xs"><option>This Term</option></select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 text-gray-400">
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Exam</th>
              <th className="text-left px-4 py-2.5 font-medium">Subject</th>
              <th className="text-left px-4 py-2.5 font-medium">Score</th>
              <th className="text-left px-4 py-2.5 font-medium">Grade</th>
              <th className="text-left px-4 py-2.5 font-medium">Position</th>
              <th className="px-4 py-2.5 font-medium" />
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {(r as any[]).map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-gray-500">{item.date}</td>
                  <td className="px-4 py-2.5 font-medium text-navy">{item.exam}</td>
                  <td className="px-4 py-2.5 text-gray-500">{item.subject}</td>
                  <td className="px-4 py-2.5 font-semibold text-navy">{item.score}</td>
                  <td className="px-4 py-2.5"><span className="font-bold text-primary">{item.grade}</span></td>
                  <td className="px-4 py-2.5 text-gray-500">{item.position}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setSelectedId(item.id)} className="flex items-center gap-1 text-primary text-[11px] font-medium hover:underline">
                      <Eye size={11} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
