import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { User, Bell, Lock, Settings as Gear, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { settingsApi } from '../../api/services';

type Tab = 'profile' | 'notification' | 'security' | 'preference';

const mockProfile = {
  name: 'John Doe', email: 'Johndoe@springhills.edu', student_id: 'STU-001', class: 'JSS 2A',
  gender: 'Male', dob: '20th April 2020', nationality: 'Nigerian',
  blood_group: 'O+', religion: 'Christianity', enrolment_date: '26th January 2026',
  phone: '+234568845555', address: '1, Admiralty way Lekki',
  guardian: { name: 'Jonathan Doe', relationship: 'Father', phone: '+234702554685', email: 'Jonathandoe@gmail.com' },
};
const mockNotif = { new_exam_scheduled: true, result_published: true, new_assignment: true, assignment_graded: true, deadlines_reminder: true, deadline_lead_time: '60 minutes before', school_announcements: true };
const mockPrefs = { language: 'English', timezone: '+1 GMT', date_format: 'DD/MM/YYYY', font_size: 'Medium' };

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>('profile');

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'notification', label: 'Notification', icon: Bell },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'preference', label: 'Preference', icon: Gear },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-navy">Settings</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Sidebar tabs */}
        <div className="sm:w-48 card p-2 h-fit">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === key ? 'bg-primary-light text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 card p-5">
          {tab === 'profile' && <ProfileTab />}
          {tab === 'notification' && <NotificationTab />}
          {tab === 'security' && <SecurityTab />}
          {tab === 'preference' && <PreferenceTab />}
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { data: profile } = useQuery({ queryKey: ['settings-profile'], queryFn: settingsApi.getProfile, placeholderData: mockProfile as any });
  const p = profile || mockProfile;
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Profile</h2>
      <div className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl mb-5">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          <User size={20} className="text-gray-400" />
        </div>
        <div>
          <p className="font-bold text-navy">{p.name}</p>
          <div className="flex items-center gap-3 text-[11px] text-gray-400 flex-wrap">
            <span>{p.email}</span><span>{p.student_id}</span><span>{p.class}</span>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-navy mb-3">Personal Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
        {[
          { label: 'Gender', value: p.gender },
          { label: 'Date of Birth', value: p.dob },
          { label: 'Nationality', value: p.nationality },
          { label: 'Blood Group', value: p.blood_group },
          { label: 'Religion', value: p.religion },
          { label: 'Enrolment Date', value: p.enrolment_date },
          { label: 'Phone', value: p.phone },
          { label: 'Address', value: p.address },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
            <p className="font-medium text-navy text-xs">{value}</p>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-bold text-navy mb-3 flex items-center gap-1">
        <span className="w-1 h-4 bg-primary rounded-full inline-block" /> Guardian Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {[
          { label: 'Name', value: p.guardian.name },
          { label: 'Relationship', value: p.guardian.relationship },
          { label: 'Phone', value: p.guardian.phone },
          { label: 'Email', value: p.guardian.email },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
            <p className="font-medium text-navy text-xs">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationTab() {
  const { data } = useQuery({ queryKey: ['notif-settings'], queryFn: settingsApi.getNotifications, placeholderData: mockNotif as any });
  const [settings, setSettings] = useState(data || mockNotif);
  const { mutate, isPending } = useMutation({ mutationFn: () => settingsApi.updateNotifications(settings as any), onSuccess: () => toast.success('Settings saved!') });

  const items = [
    { key: 'new_exam_scheduled', label: 'New Exam Scheduled', desc: 'When a new exam is created for your class' },
    { key: 'result_published', label: 'Result Published', desc: 'When your exam result is available' },
    { key: 'new_assignment', label: 'New Assignment', desc: 'Notify when your exam goes live' },
    { key: 'assignment_graded', label: 'Assignment Graded', desc: 'When your assignment is graded with feedback' },
    { key: 'deadlines_reminder', label: 'Deadlines & Reminder', desc: 'Remind you about upcoming exams and assignment deadlines' },
    { key: 'school_announcements', label: 'School Announcements', desc: 'Receive school-wide announcements from admin' },
  ];

  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Notification Settings</h2>
      <div className="space-y-4">
        {items.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-navy">{label}</p>
              <p className="text-xs text-gray-400">{desc}</p>
            </div>
            <Toggle checked={(settings as any)[key] ?? true} onChange={v => setSettings(s => ({ ...s, [key]: v }))} />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-navy mb-1.5">Deadline Reminder Lead Time</label>
          <select className="input-field" value={(settings as any).deadline_lead_time} onChange={e => setSettings(s => ({ ...s, deadline_lead_time: e.target.value }))}>
            {['15 minutes before','30 minutes before','60 minutes before','2 hours before','1 day before'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => mutate()} disabled={isPending} className="btn-primary w-full mt-6">{isPending ? 'Saving…' : 'Save'}</button>
    </div>
  );
}

function SecurityTab() {
  const [form, setForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [show, setShow] = useState({ cur: false, new: false, conf: false });
  const { mutate, isPending } = useMutation({
    mutationFn: () => settingsApi.updatePassword(form as any),
    onSuccess: () => { toast.success('Password updated!'); setForm({ current_password: '', new_password: '', confirm_password: '' }); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update password'),
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) return toast.error('Passwords do not match');
    if (form.new_password.length < 8) return toast.error('Must be at least 8 characters');
    mutate();
  };
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Security Settings</h2>
      <form onSubmit={handleSubmit}>
        <h3 className="text-sm font-semibold text-navy mb-3">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Current Password</label>
            <div className="relative">
              <input type={show.cur ? 'text' : 'password'} value={form.current_password} onChange={e => setForm(f => ({...f, current_password: e.target.value}))} className="input-field pr-9" placeholder="••••••••••" />
              <button type="button" onClick={() => setShow(s=>({...s,cur:!s.cur}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show.cur ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">New Password</label>
            <div className="relative">
              <input type={show.new ? 'text' : 'password'} value={form.new_password} onChange={e => setForm(f => ({...f, new_password: e.target.value}))} className="input-field pr-9" placeholder="••••••••••" />
              <button type="button" onClick={() => setShow(s=>({...s,new:!s.new}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show.new ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs font-medium text-gray-600 block mb-1">Confirm New Password</label>
          <div className="relative">
            <input type={show.conf ? 'text' : 'password'} value={form.confirm_password} onChange={e => setForm(f => ({...f, confirm_password: e.target.value}))} className="input-field pr-9" placeholder="••••••••••" />
            <button type="button" onClick={() => setShow(s=>({...s,conf:!s.conf}))} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{show.conf ? <EyeOff size={13}/> : <Eye size={13}/>}</button>
          </div>
        </div>
        <button type="submit" disabled={isPending} className="btn-primary w-full">{isPending ? 'Updating…' : 'Update Password'}</button>
      </form>
    </div>
  );
}

function PreferenceTab() {
  const { data } = useQuery({ queryKey: ['preferences'], queryFn: settingsApi.getPreferences, placeholderData: mockPrefs as any });
  const [prefs, setPrefs] = useState(data || mockPrefs);
  const { mutate, isPending } = useMutation({ mutationFn: () => settingsApi.updatePreferences(prefs as any), onSuccess: () => toast.success('Preferences saved!') });
  return (
    <div>
      <h2 className="font-bold text-navy text-center mb-5">Preferences</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Language</label>
          <select className="input-field" value={(prefs as any).language} onChange={e => setPrefs(p=>({...p,language:e.target.value}))}>
            {['English','French','Spanish','Hausa','Yoruba','Igbo'].map(l=><option key={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Time Zone</label>
          <select className="input-field" value={(prefs as any).timezone} onChange={e => setPrefs(p=>({...p,timezone:e.target.value}))}>
            {['+1 GMT','+2 GMT','+3 GMT','UTC','-5 GMT'].map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Date Format</label>
          <input className="input-field" value={(prefs as any).date_format} onChange={e => setPrefs(p=>({...p,date_format:e.target.value}))} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 block mb-1">Font size</label>
          <select className="input-field" value={(prefs as any).font_size} onChange={e => setPrefs(p=>({...p,font_size:e.target.value}))}>
            {['Small','Medium','Large'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <button onClick={() => mutate()} disabled={isPending} className="btn-primary w-full">{isPending ? 'Saving…' : 'Save'}</button>
    </div>
  );
}
