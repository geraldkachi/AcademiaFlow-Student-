import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, X } from 'lucide-react';
import { dashboardApi } from '../api/services';

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: dashboardApi.getNotifications,
  });

  // Mock data for UI while API is not connected
  const items = notifications.length ? notifications : [
    { id: '1', title: 'Second Term Mid-Term Exams Schedule', message: 'Dear students and parents, please note that mid-term examinations are scheduled to begin on March 2, 2026. Students are to come prepared with their exam cards and stationery.', read: false, created_at: '' },
    { id: '2', title: 'Mathematics Assignment Deadline', message: 'This is a reminder that the Mathematics assignment for Grade 10A is due on February 23, 2026. Please...', read: true, created_at: '' },
    { id: '3', title: 'Second Term Mid-Term Exams Schedule', message: 'Attention parents: The deadline for second term school fees is February 28, 2026.', read: true, created_at: '' },
  ];

  return (
    <div className="absolute right-0 top-11 bg-white border border-gray-100 rounded-xl shadow-modal w-80 z-50 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
        <button onClick={onClose}><ArrowLeft size={16} className="text-gray-500" /></button>
        <span className="font-semibold text-navy text-sm">Notifications</span>
        <button onClick={onClose} className="ml-auto"><X size={14} className="text-gray-400" /></button>
      </div>
      <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
        {items.map(n => (
          <div key={n.id} className={`px-4 py-3 ${!n.read ? 'bg-primary-light/30' : ''}`}>
            <div className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-primary' : 'bg-gray-300'}`} />
              <div>
                <p className="text-xs font-semibold text-navy mb-0.5">{n.title}</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">{n.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
