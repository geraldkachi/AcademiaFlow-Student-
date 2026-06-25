import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { examsApi } from '../../api/services';

interface Props { session: any; exam: any; onEnd: () => void }

export default function ExamTaking({ session, exam, onEnd }: Props) {
  const questions = session.questions || [];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(session.duration || 3600);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [submitted, setSubmitted] = useState<any>(null);

  useEffect(() => {
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft((s: number) => s - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft]);

  const fmt = (s: number) => `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const { mutate: submitExam } = useMutation({
    mutationFn: () => examsApi.submitExam({ exam_id: session.exam_id, answers, time_taken: (session.duration || 3600) - timeLeft }),
    onSuccess: (res) => setSubmitted(res),
    onError: () => setSubmitted({ total_answered: Object.keys(answers).length, not_answered: questions.length - Object.keys(answers).length, time_taken: fmt((session.duration || 3600) - timeLeft) }),
  });

  const handleSubmit = useCallback(() => { submitExam(); setShowSubmit(false); }, [answers]);

  const q = questions[current];
  const answered = Object.keys(answers).length;
  const notAnswered = questions.length - answered;

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center max-w-sm p-8">
          <div className="w-20 h-20 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M20 4L4 12L20 20L36 12L20 4Z" fill="#0f2d40"/><path d="M6 15.5V24C6 24 10.5 28 20 28C29.5 28 34 24 34 24V15.5L20 21.5L6 15.5Z" fill="#16a34a"/></svg>
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Exam Submitted</h2>
          <div className="grid grid-cols-3 gap-3 my-5 text-center">
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-lg font-bold text-primary">{submitted.total_answered ?? answered}</p><p className="text-[10px] text-gray-400">Total Answered</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-lg font-bold text-navy">{submitted.subject ?? exam?.subject}</p><p className="text-[10px] text-gray-400">Subject</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-lg font-bold text-orange-500">{submitted.time_taken}</p><p className="text-[10px] text-gray-400">Time Taken</p></div>
          </div>
          <p className="text-xs text-gray-500 mb-5">Your answers have been submitted. You will be notified once your results are published.</p>
          <button onClick={onEnd} className="btn-primary w-full">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className=" inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 py-3 border-b border-gray-100">
        <h2 className="font-bold text-navy">{exam?.subject || 'Chemistry'}</h2>
        <span className="font-mono text-sm font-semibold text-gray-600">{fmt(timeLeft)}</span>
        <button onClick={() => setShowEnd(true)} className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600">End Exam</button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question area */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-12 py-8">
          <p className="text-primary font-semibold text-sm mb-3">Question {q?.number}</p>
          <p className="text-navy text-sm mb-6 leading-relaxed">{q?.text}</p>
          {q?.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt: string, i: number) => (
                <label key={i} className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${answers[q.id] === opt ? 'border-primary bg-primary-light' : 'border-gray-200 hover:border-primary/40'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${answers[q.id] === opt ? 'border-primary' : 'border-gray-300'}`}>
                    {answers[q.id] === opt && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                  <input type="radio" className="hidden" checked={answers[q.id] === opt} onChange={() => setAnswers(a => ({ ...a, [q.id]: opt }))} />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between mt-8">
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0} className="btn-outline disabled:opacity-40">Previous</button>
            {current < questions.length - 1
              ? <button onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))} className="btn-primary">Next</button>
              : <button onClick={() => setShowSubmit(true)} className="btn-primary">Submit</button>
            }
          </div>
        </div>

        {/* Navigation panel */}
        <div className="hidden sm:block w-52 border-l border-gray-100 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 mb-3">Question Navigation</p>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {questions.map((_: any, i: number) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`w-8 h-8 rounded text-[11px] font-semibold transition-all
                  ${i === current ? 'bg-primary text-white' : answers[questions[i]?.id] ? 'bg-primary-light text-primary border border-primary/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary-light border border-primary/30 rounded" /><span className="text-gray-500">Answered ({answered})</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-100 rounded" /><span className="text-gray-500">Not Answered ({notAnswered})</span></div>
          </div>
          <button onClick={() => setShowSubmit(true)} className="btn-primary w-full mt-4 text-xs">Submit</button>
        </div>
      </div>

      {/* Submit confirmation */}
      {showSubmit && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-modal">
            <h3 className="font-bold text-navy mb-2">Submit Exam</h3>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to submit your exam? This action cannot be undone.</p>
            <div className="flex gap-3 mb-3 justify-center text-[11px]">
              <span className="bg-primary-light text-primary px-3 py-1 rounded-full font-medium">{answered} Answered</span>
              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">{notAnswered} Not Answered</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowSubmit(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleSubmit} className="btn-primary flex-1">Submit Exam</button>
            </div>
          </div>
        </div>
      )}

      {/* End exam confirmation */}
      {showEnd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-xs w-full text-center shadow-modal">
            <h3 className="font-bold text-navy mb-2">End Exam</h3>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to end your exam? Your exam will be automatically submitted.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowEnd(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => { setShowEnd(false); handleSubmit(); }} className="bg-red-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-red-600 flex-1">End Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
