import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import SchoolBadge from '../../components/SchoolBadge';
import { authApi } from '../../api/services';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.resetPassword({
      email: state?.email || '',
      code: state?.code || '',
      password: form.password,
      password_confirmation: form.confirm,
    }),
    onSuccess: () => navigate('/password-reset-success'),
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to reset password'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters');
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    mutate();
  };

  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy" />
      <h2 className="text-lg font-bold text-navy text-center mb-1">Create New Password</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Create new password for your account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPwd ? 'text' : 'password'} required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••••••••"
              className="input-field pr-10"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'} required
              value={form.confirm}
              onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="••••••••••••••"
              className="input-field pr-10"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Password must be at least 8 characters</p>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary w-full mt-1">
          {isPending ? 'Setting…' : 'Set new password'}
        </button>
      </form>
    </AuthLayout>
  );
}
