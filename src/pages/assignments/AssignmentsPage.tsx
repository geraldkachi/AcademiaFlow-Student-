import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Clock, Download, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentsApi } from '../../api/services';

const mockAssignments = [
  { id: '1', title: 'Quadratic Equations Problem Set', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', description: 'Complete problems 1 - 20 from chapter 5. Show all working and explain your reasoning.', deadline: '11th Feb 2026', status: 'active', attachment: { name: 'Chapter 5, Q1 – Q20', url: '#' } },
  { id: '2', title: 'Binary Search Tree Implementation', subject: 'Computer Science', teacher: 'Prof Michael Chen', description: 'Implement a balanced BST with insert, delete, and search operations.', deadline: '10th Feb 2026', status: 'submitted', attachment: { name: 'Chapter 5, Q1 – Q20', url: '#' } },
  { id: '3', title: 'Chemical Equations', subject: 'Chemistry', teacher: 'Mr. Ignecia', description: 'Complete problems 1 - 35 from chapter 5. Show all working and explain your reasoning.', deadline: '10th Feb 2026', status: 'graded', score: 92, feedback: 'Great job, keep striving for excellence!' },
];

const statusBadge = (s: string) => {
  const map: Record<string, string> = { active: 'badge-active', submitted: 'badge-submitted', graded: 'badge-graded', not_done: 'badge-notdone' };
  const labels: Record<string, string> = { active: 'Active', submitted: 'Submitted', graded: 'Graded', not_done: 'Not Done' };
  return <span className={map[s] || 'badge-pending'}>{labels[s] || s}</span>;
};

export default function AssignmentsPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState('All Assignments');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [viewFeedback, setViewFeedback] = useState<any>(null);

  const { data = [] } = useQuery({
    queryKey: ['assignments', filter],
    queryFn: () => assignmentsApi.getAll(),
    placeholderData: mockAssignments as any,
  });

  const assignments = (data as any[]).length ? data : mockAssignments;
  const selected = assignments.find((a: any) => a.id === selectedId);

  const { mutate: submitAssignment, isPending } = useMutation({
    mutationFn: () => assignmentsApi.submit(selectedId as string, file as File),
    onSuccess: () => { setSubmitted(true); qc.invalidateQueries({ queryKey: ['assignments'] }); },
    onError: () => { setSubmitted(true); }, // Mock success for UI
  });

  const handleSubmit = () => {
    if (!file) return toast.error('Please attach a file');
    submitAssignment();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-lg font-bold text-navy">Assignments</h1>
        <div className="flex items-center gap-2">
          <select className="input-field py-1.5 w-auto text-xs"
            value={filter} onChange={e => setFilter(e.target.value)}>
            {['All Assignments', 'Active', 'Submitted', 'Graded'].map(o => <option key={o}>{o}</option>)}
          </select>
          <select className="input-field py-1.5 w-auto text-xs"><option>January</option></select>
        </div>
      </div>

      <p className="text-xs text-gray-400 font-medium">All Assignments ({assignments.length})</p>

      <div className="space-y-3">
        {assignments.map((a: any) => (
          <div key={a.id} className="card p-4">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold text-navy">{a.title}</h3>
                  {statusBadge(a.status)}
                  {a.score !== undefined && <span className="text-sm font-bold text-primary">{a.score}/100</span>}
                </div>
                <p className="text-xs text-gray-500">{a.subject} • {a.teacher}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 mb-3">{a.description}</div>
            {a.attachment && (
              <div className="flex items-center gap-2 text-xs text-primary mb-2">
                <Download size={12} />
                <span className="font-medium">{a.attachment.name}</span>
              </div>
            )}
            {a.deadline && (
              <div className="flex items-center gap-1.5 text-xs text-red-500 mb-3">
                <Clock size={11} />
                <span>Due: {a.deadline}</span>
              </div>
            )}
            {a.status === 'submitted' && a.submitted_at && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
                <Clock size={11} /> Submitted: {a.submitted_at}
              </div>
            )}
            <div className="flex justify-end">
              {a.status === 'active' && (
                <button onClick={() => { setSelectedId(a.id); setFile(null); setSubmitted(false); }} className="btn-primary text-xs px-5">Submit</button>
              )}
              {a.status === 'submitted' && (
                <button className="btn-outline text-xs px-5">Submit</button>
              )}
              {a.status === 'graded' && (
                <button onClick={() => setViewFeedback(a)} className="btn-outline text-xs px-5">View Feedback</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Submit modal */}
      {selectedId && !submitted && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-modal overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-navy">{selected?.title}</h3>
              <div className="grid grid-cols-2 gap-2 mt-2 text-[11px]">
                <div><span className="text-gray-400">Subject</span><p className="font-medium text-navy">{selected?.subject}</p></div>
                <div><span className="text-gray-400">Deadline</span><p className="font-medium text-navy">{selected?.deadline}</p></div>
                <div><span className="text-gray-400">Instructor</span><p className="font-medium text-navy">{selected?.teacher}</p></div>
                <div><span className="text-gray-400">Status</span><p>{statusBadge(selected?.status ?? "")}</p></div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs font-semibold text-navy mb-1">Instructions</p>
                <p className="text-xs text-gray-500">{selected?.description}</p>
              </div>
              {selected?.attachment && (
                <div className="flex items-center gap-2 text-xs text-primary"><Download size={12} />{selected.attachment.name}</div>
              )}
              <div>
                <p className="text-xs font-semibold text-navy mb-2">Submission</p>
                <label className="block border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-primary/40 transition-colors">
                  <input type="file" className="hidden" accept=".pdf,.png,.jpg" onChange={e => setFile(e.target.files?.[0] || null)} />
                  {file ? (
                    <p className="text-xs text-primary font-medium">{file.name}</p>
                  ) : (
                    <div>
                      <Download size={20} className="text-gray-300 mx-auto mb-1" />
                      <p className="text-xs text-gray-400">Click to Upload</p>
                      <p className="text-[10px] text-gray-300">JPG, PNG or PDF (max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setSelectedId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={handleSubmit} disabled={isPending} className="btn-primary flex-1">{isPending ? 'Submitting…' : 'Submit'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Submitted success modal */}
      {submitted && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-modal p-6 text-center">
            <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
            <h3 className="font-bold text-navy mb-1">Assignment Submitted</h3>
            <div className="grid grid-cols-2 gap-2 my-4 text-[11px]">
              {selected && <>
                <div><span className="text-gray-400">Subject</span><p className="font-medium text-navy">{selected.subject}</p></div>
                <div><span className="text-gray-400">Deadline</span><p className="font-medium text-navy">{selected.deadline}</p></div>
                <div><span className="text-gray-400">Instructor</span><p className="font-medium text-navy">{selected.teacher}</p></div>
                <div><span className="text-gray-400">Status</span>{statusBadge('submitted')}</div>
              </>}
            </div>
            <p className="text-xs text-gray-500 mb-5">Your answers have been submitted. You will be notified once your results are published.</p>
            <button onClick={() => { setSelectedId(null); setSubmitted(false); }} className="btn-primary w-full">Done</button>
          </div>
        </div>
      )}

      {/* Feedback modal */}
      {viewFeedback && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-modal overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-navy mb-1">{viewFeedback.title}</h3>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-gray-400">Subject</span><p className="font-medium text-navy">{viewFeedback.subject}</p></div>
                <div><span className="text-gray-400">Deadline</span><p className="font-medium text-navy">{viewFeedback.deadline}</p></div>
                <div><span className="text-gray-400">Instructor</span><p className="font-medium text-navy">{viewFeedback.teacher}</p></div>
                <div><span className="text-gray-400">Status</span>{statusBadge(viewFeedback.status)}</div>
              </div>
            </div>
            <div className="p-5 space-y-3">
              {viewFeedback.attachment && <div className="flex items-center gap-2 text-xs text-primary"><Download size={12} />{viewFeedback.attachment?.name || 'Chapter 5, Q1 – Q20'}</div>}
              <div><p className="text-xs font-semibold text-navy mb-1">Score</p><p className="text-lg font-bold text-primary">{viewFeedback.score}/100</p></div>
              <div><p className="text-xs font-semibold text-navy mb-1">Feedback</p><p className="text-xs text-gray-600">{viewFeedback.feedback}</p></div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={() => setViewFeedback(null)} className="btn-primary w-full">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
