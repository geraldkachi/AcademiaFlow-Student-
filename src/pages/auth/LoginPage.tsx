import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import SchoolBadge from '../../components/SchoolBadge';
import { authApi } from '../../api/services';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember: true });
  const [showPwd, setShowPwd] = useState(false);

  const { mutate: login, isPending } = useMutation({
    mutationFn: () => authApi.login({ email: form.email, password: form.password, remember_me: form.remember }),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields');
    login();
  };

  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy" />
      <h2 className="text-lg font-bold text-navy text-center mb-1">Welcome Back</h2>
      <p className="text-xs text-gray-400 text-center mb-6">Let's get the learning started</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Student Email</label>
          <input
            type="email" required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="JohnDoe23@springhills.edu"
            className="input-field"
          />
        </div>
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox" checked={form.remember}
              onChange={e => setForm(f => ({ ...f, remember: e.target.checked }))}
              className="w-3.5 h-3.5 accent-primary rounded"
            />
            Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-xs text-primary font-medium hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={isPending} className="btn-primary w-full mt-1">
          {isPending ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </AuthLayout>
  );
}
