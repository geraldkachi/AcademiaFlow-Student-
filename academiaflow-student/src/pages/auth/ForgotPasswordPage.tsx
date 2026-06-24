import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/AuthLayout';
import SchoolBadge from '../../components/SchoolBadge';
import { authApi } from '../../api/services';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.forgotPassword({ email }),
    onSuccess: () => {
      navigate('/verify-code', { state: { email } });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Email not found');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    mutate();
  };

  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy" />
      <h2 className="text-lg font-bold text-navy text-center mb-1">Forgot Password</h2>
      <p className="text-xs text-gray-400 text-center mb-6">We will send you a verification code</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1.5">Student Email</label>
          <input
            type="email" required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="JohnDoe23@springhills.edu"
            className="input-field"
          />
        </div>

        <Link to="/login" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-navy transition-colors w-fit">
          <ArrowLeft size={12} /> Back to Login
        </Link>

        <button type="submit" disabled={isPending} className="btn-primary w-full mt-1">
          {isPending ? 'Sending…' : 'Send Verification Code'}
        </button>
      </form>
    </AuthLayout>
  );
}
