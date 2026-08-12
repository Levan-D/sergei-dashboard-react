import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import { reportHighlights } from '@/components/landing/highlights';
import useScreenDimensions from '@/hooks/use-screen-dimensions';
import LandingLayout from '@/layout/landing-layout/LandingLayout';
import HomePage from '@/pages/landing/HomePage';
import ModelPage from '@/pages/landing/ModelPage';
import GenerationPage from '@/pages/landing/GenerationPage';
import AdminLayout from '@/layout/admin-layout/AdminLayout';
import DashboardPage from '@/pages/_admin/DashboardPage';
import LandingPage from '@/pages/_admin/LandingPage';
import CatalogPage from '@/pages/_admin/CatalogPage';
import ModelEditorPage from '@/pages/_admin/ModelEditorPage';
import GenEditorPage from '@/pages/_admin/GenEditorPage';
import MediaPage from '@/pages/_admin/MediaPage';
import BrandStylePage from '@/pages/_admin/BrandStylePage';
import CommunityPage from '@/pages/_admin/CommunityPage';
import UsersPage from '@/pages/_admin/UsersPage';
import NotificationsPage from '@/pages/_admin/NotificationsPage';
import HistoryPage from '@/pages/_admin/HistoryPage';
import SettingsPage from '@/pages/_admin/SettingsPage';

export default function App() {
  useScreenDimensions();

  useEffect(() => {
    reportHighlights();
  }, []);

  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path={ROUTING.home} element={<HomePage />} />
        <Route path=":model" element={<ModelPage />} />
        <Route path=":model/:gen" element={<GenerationPage />} />
      </Route>
      <Route path={ROUTING.admin} element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path={ROUTING.adminLanding} element={<LandingPage />} />
        <Route path={ROUTING.adminCatalog} element={<CatalogPage />} />
        <Route path={`${ROUTING.adminCatalogModel}:name`} element={<ModelEditorPage />} />
        <Route path={`${ROUTING.adminCatalogGen}:name`} element={<GenEditorPage />} />
        <Route path={ROUTING.adminMedia} element={<MediaPage />} />
        <Route path={ROUTING.adminStyle} element={<BrandStylePage />} />
        <Route path={ROUTING.adminCommunity} element={<CommunityPage />} />
        <Route path={ROUTING.adminUsers} element={<UsersPage />} />
        <Route path={ROUTING.adminNotifications} element={<NotificationsPage />} />
        <Route path={ROUTING.adminHistory} element={<HistoryPage />} />
        <Route path={ROUTING.adminSettings} element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTING.home} replace />} />
    </Routes>
  );
}
