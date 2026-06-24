import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const titleMap: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/exams': 'Exams',
  '/assignments': 'Assignments',
  '/results': 'Results',
  '/subjects': 'Subjects',
  '/schedules': 'Schedule',
  '/settings': 'Settings',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = titleMap[pathname] || '';

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
