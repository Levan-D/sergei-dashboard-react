import { useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';
import { ROUTING } from '@/lib/routing';
import Button from '@/components/_admin/ui/Button';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { NotifyItem } from '@/components/_admin/NotifyItem';

export default function NotificationsPage() {
  const navigate = useNavigate();
  return (
    <SectionCard>
      <SectionHeader
        title="Notifications"
        right={
          <Button variant="ghost" sm onClick={() => showToast('✅ All marked as read')}>
            Mark all read
          </Button>
        }
      />
      <NotifyItem
        meta="2 hours ago · Cars Catalog"
        onClick={() => {
          navigate(ROUTING.adminCatalog);
          showToast('📋 Viewing BMW M2 G87 in catalog');
        }}
      >
        <strong>New model added</strong> — BMW M2 G87 added to catalog by Motority team. Add your brand images and
        description.
      </NotifyItem>
      <NotifyItem
        meta="1 day ago · Cars Catalog"
        onClick={() => {
          navigate(ROUTING.adminCatalog);
          showToast('📋 Viewing BMW 3 Series G20 LCI');
        }}
      >
        <strong>New generation</strong> — BMW 3 Series G20 LCI added. Upload generation images and external links.
      </NotifyItem>
      <NotifyItem
        meta="3 days ago · Community"
        onClick={() => {
          navigate(ROUTING.adminCommunity);
          showToast('📊 Community stats');
        }}
      >
        <strong>Community growth</strong> — 47 new logbooks created this week for BMW models.
      </NotifyItem>
      <NotifyItem read meta="5 days ago · Landing Page">
        Hero image uploaded successfully to landing page.
      </NotifyItem>
      <NotifyItem read meta="1 week ago · Brand Style">
        Brand colors updated and applied to landing.
      </NotifyItem>
    </SectionCard>
  );
}
