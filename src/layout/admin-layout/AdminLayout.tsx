import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { adminToastTransition } from '@/lib/toast';
import Drawer from '@/components/_admin/Drawer';
import { ThemeProvider } from './theme-context';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout() {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="admin flex">
        <Sidebar className="max-md:hidden" />
        <Drawer open={navOpen} onClose={() => setNavOpen(false)}>
          <Sidebar className="static h-full" onNavigate={() => setNavOpen(false)} />
        </Drawer>
        <div className="ml-60 flex h-dvh flex-1 flex-col overflow-hidden max-md:ml-0">
          <Topbar onMenuClick={() => setNavOpen(true)} />
          <div id="admin-scroll" className="h-[calc(100dvh-56px)] flex-1 overflow-y-auto overscroll-contain p-4 md:p-6">
            <div className="@container mx-auto w-full max-w-[1600px]">
              <Outlet />
            </div>
          </div>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={2800}
          hideProgressBar
          closeButton={false}
          icon={false}
          closeOnClick={false}
          draggable={false}
          transition={adminToastTransition}
        />
      </div>
    </ThemeProvider>
  );
}
