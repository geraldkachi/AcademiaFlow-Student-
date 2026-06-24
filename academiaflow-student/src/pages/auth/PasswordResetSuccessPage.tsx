import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import SchoolBadge from '../../components/SchoolBadge';

export default function PasswordResetSuccessPage() {
  const navigate = useNavigate();
  return (
    <AuthLayout>
      <SchoolBadge name="Spring Hills Academy" />
      <h2 className="text-lg font-bold text-navy text-center mb-1">Password Reset</h2>
      <p className="text-xs text-gray-400 text-center mb-8">Your password reset was successful</p>
      {/* Celebration illustration */}
      <div className="flex justify-center mb-8">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="#dcfce7" />
          <path d="M25 40l10 10 20-20" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="3" fill="#16a34a" opacity=".4"/>
          <circle cx="60" cy="18" r="2" fill="#16a34a" opacity=".5"/>
          <circle cx="63" cy="58" r="3" fill="#16a34a" opacity=".3"/>
          <circle cx="17" cy="55" r="2" fill="#16a34a" opacity=".4"/>
        </svg>
      </div>
      <button onClick={() => navigate('/login')} className="btn-primary w-full">
        Go to Login
      </button>
    </AuthLayout>
  );
}
