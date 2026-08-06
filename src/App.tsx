import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import AppLayout from '@/layout/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import LandingPage from '@/pages/LandingPage';
import CatalogPage from '@/pages/CatalogPage';
import ModelEditorPage from '@/pages/ModelEditorPage';
import GenEditorPage from '@/pages/GenEditorPage';
import MediaPage from '@/pages/MediaPage';
import BrandStylePage from '@/pages/BrandStylePage';
import CommunityPage from '@/pages/CommunityPage';
import UsersPage from '@/pages/UsersPage';
import NotificationsPage from '@/pages/NotificationsPage';
import HistoryPage from '@/pages/HistoryPage';
import SettingsPage from '@/pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="landing" element={<LandingPage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="catalog/model/:name" element={<ModelEditorPage />} />
        <Route path="catalog/gen/:name" element={<GenEditorPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="style" element={<BrandStylePage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTING.admin} replace />} />
    </Routes>
  );
}
