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

const BATCH_SIZE = 20;

const SURFACE_ROUTES: Record<string, string> = {
  landing: ROUTING.adminLanding,
  catalog: ROUTING.adminCatalog,
  community: ROUTING.adminCommunity,
};

type Props = {
  items: AdminNotificationType[];
  unreadCount: number;
  onRefetch: () => void;
};

function NotificationsList({ items, unreadCount, onRefetch }: Props) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [readNotification] = useReadAdminNotificationMutation();
  const [readAll, { isLoading: isMarkingAll }] = useReadAllAdminNotificationsMutation();

  const visible = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const sentinelRef = useInfiniteScroll({
    hasMore,
    isFetching: false,
    onLoadMore: () => setVisibleCount((v) => v + BATCH_SIZE),
  });

  const onMarkAll = async () => {
    try {
      await readAll({ subdomain: brand.makeSlug }).unwrap();
      onRefetch();
      showToast('✅ All marked as read');
    } catch {
      showToast('⚠️ Could not mark notifications as read');
    }
  };

  const onOpen = (notification: AdminNotificationType) => {
    if (!notification.read) {
      readNotification({ subdomain: brand.makeSlug, id: notification.id })
        .unwrap()
        .then(onRefetch)
        .catch(() => undefined);
    }
    const route = SURFACE_ROUTES[notification.surface];
    if (route) navigate(route);
  };

  return (
    <SectionCard>
      <SectionHeader
        title="Notifications"
        right={
          <Button variant="ghost" sm loading={isMarkingAll} disabled={unreadCount === 0} onClick={onMarkAll}>
            Mark all read
          </Button>
        }
      />
      {items.length === 0 && <p className="p-5 text-sm text-ink-3">No notifications yet.</p>}
      {visible.map((notification) => (
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

export default function NotificationsPage() {
  const { data, isError, error, isFetching, refetch } = useGetAdminNotificationsQuery({ subdomain: brand.makeSlug });

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;
  return <NotificationsList items={data.items} unreadCount={data.unread_count} onRefetch={refetch} />;
}
