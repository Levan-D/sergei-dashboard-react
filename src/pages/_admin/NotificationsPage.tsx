import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { ROUTING } from '@/lib/routing';
import useInfiniteScroll from '@/hooks/use-infinite-scroll';
import {
  useGetAdminNotificationsQuery,
  useReadAdminNotificationMutation,
  useReadAllAdminNotificationsMutation,
  type AdminNotificationType,
} from '@/lib/redux/api/admin-api/notifications/notifications-api';
import Button from '@/components/_admin/ui/Button';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { NotifyItem } from '@/components/_admin/NotifyItem';

const SURFACE_ROUTES: Record<string, string> = {
  landing: ROUTING.adminLanding,
  catalog: ROUTING.adminCatalog,
  community: ROUTING.adminCommunity,
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isError, error, isFetching, refetch } = useGetAdminNotificationsQuery({
    subdomain: brand.makeSlug,
    page,
  });
  const [readNotification] = useReadAdminNotificationMutation();
  const [readAll, { isLoading: isMarkingAll }] = useReadAllAdminNotificationsMutation();

  const items = data?.items ?? [];
  const hasMore = !!data && data.current_page < data.last_page;
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isFetching,
    onLoadMore: () => setPage((p) => p + 1),
  });

  const onMarkAll = async () => {
    try {
      await readAll({ subdomain: brand.makeSlug }).unwrap();
      setPage(1);
      refetch();
      showToast('✅ All marked as read');
    } catch {
      showToast('⚠️ Could not mark notifications as read');
    }
  };

  const onOpen = (notification: AdminNotificationType) => {
    if (!notification.read) {
      readNotification({ subdomain: brand.makeSlug, id: notification.id })
        .unwrap()
        .then(() => refetch())
        .catch(() => undefined);
    }
    const route = SURFACE_ROUTES[notification.surface];
    if (route) navigate(route);
  };

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;

  return (
    <SectionCard>
      <SectionHeader
        title="Notifications"
        sub={`${data.total} total · ${data.unread_count} unread`}
        right={
          <Button variant="ghost" sm loading={isMarkingAll} disabled={data.unread_count === 0} onClick={onMarkAll}>
            Mark all read
          </Button>
        }
      />
      {items.length === 0 && <p className="p-5 text-sm text-ink-3">No notifications yet.</p>}
      {items.map((notification) => (
        <NotifyItem
          key={notification.id}
          read={notification.read}
          meta={notification.meta}
          onClick={() => onOpen(notification)}
        >
          <strong>{notification.title}</strong> — {notification.body}
        </NotifyItem>
      ))}
      {hasMore && (
        <div ref={sentinelRef}>
          <Spinner className="py-6" />
        </div>
      )}
    </SectionCard>
  );
}
