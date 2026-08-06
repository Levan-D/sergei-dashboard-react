import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Toast from '@/components/Toast';
import Modals from '@/features/modals/Modals';

/** App shell: sidebar + topbar + routed page outlet, plus the global modal/toast layer. */
export default function AppLayout() {
  const theme = useAppSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex h-screen flex-1 flex-col overflow-hidden">
        <Topbar />
        <div className="h-[calc(100vh-56px)] flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
      <Modals />
      <Toast />
    </div>
  );
}
