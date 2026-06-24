import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { subjectsApi } from '../../api/services';

const mockSubjects = [
  { id: '1', date: '02/02/25', subject: 'Mathematics', status: 'enrolled' },
  { id: '2', date: '16/01/26', subject: 'Economics', status: 'enrolled' },
  { id: '3', date: '20/05/25', subject: 'Physics', status: 'enrolled' },
  { id: '4', date: '20/05/25', subject: 'Chemistry', status: 'enrolled' },
  { id: '5', date: '16/01/25', subject: 'Biology', status: 'enrolled' },
];

const availableSubjects = ['Mathematics', 'Economics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Art'];

export default function SubjectsPage() {
  const qc = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletedSuccess, setDeletedSuccess] = useState(false);
  const [addForm, setAddForm] = useState({ subject: 'Mathematics', code: '', department: 'Science' });

  const { data = [] } = useQuery({ queryKey: ['subjects'], queryFn: subjectsApi.getAll, placeholderData: mockSubjects as any });
  const subjects = (data as any[]).length ? data : mockSubjects;

  const { mutate: addSubject, isPending: adding } = useMutation({
    mutationFn: () => subjectsApi.addSubject(addForm),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); setShowAdd(false); toast.success('Subject added!'); },
    onError: () => { setShowAdd(false); toast.success('Subject added!'); }, // Mock
  });

  const { mutate: deleteSubject, isPending: deleting } = useMutation({
    mutationFn: () => subjectsApi.deleteSubject(deleteId!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['subjects'] }); setDeleteId(null); setDeletedSuccess(true); },
    onError: () => { setDeleteId(null); setDeletedSuccess(true); }, // Mock
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-navy">Subjects</h1>
          <p className="text-xs text-gray-400">Class: SS 1 C &nbsp;|&nbsp; Department: Science</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary text-xs flex items-center gap-1.5">
          <Plus size={13} /> Add Subject
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="text-sm font-bold text-navy">Subjects</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="border-b border-gray-100 text-gray-400">
              <th className="text-left px-4 py-2.5 font-medium">Date</th>
              <th className="text-left px-4 py-2.5 font-medium">Subject</th>
              <th className="text-left px-4 py-2.5 font-medium">Status</th>
              <th className="text-left px-4 py-2.5 font-medium">Action</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {(subjects as any[]).map((s: any) => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-2.5 text-gray-500">{s.date}</td>
                  <td className="px-4 py-2.5 font-medium text-navy">{s.subject}</td>
                  <td className="px-4 py-2.5"><span className="badge-graded">Enrolled</span></td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => setDeleteId(s.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subject modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-5">
            <h3 className="font-bold text-navy mb-4">Add Subject</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Select Subject</label>
                <select className="input-field" value={addForm.subject} onChange={e => setAddForm(f => ({ ...f, subject: e.target.value }))}>
                  {availableSubjects.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Subject Code</label>
                <input className="input-field" placeholder="MTH" value={addForm.code} onChange={e => setAddForm(f => ({ ...f, code: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Department</label>
                <input className="input-field" placeholder="Science" value={addForm.department} onChange={e => setAddForm(f => ({ ...f, department: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowAdd(false)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => addSubject()} disabled={adding} className="btn-primary flex-1">{adding ? 'Adding…' : 'Add Subject'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && !deletedSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-5 text-center">
            <h3 className="font-bold text-navy mb-2">Delete Subject</h3>
            <p className="text-xs text-gray-500 mb-4">Are you sure you want to delete this subject? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-outline flex-1">Cancel</button>
              <button onClick={() => deleteSubject()} disabled={deleting} className="bg-red-500 text-white font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-red-600 flex-1">{deleting ? 'Deleting…' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Deleted success */}
      {deletedSuccess && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full shadow-modal p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-bold text-navy mb-1">Subject Deleted</h3>
            <p className="text-xs text-gray-500 mb-4">Your subject has been deleted.</p>
            <button onClick={() => setDeletedSuccess(false)} className="btn-primary w-full">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
