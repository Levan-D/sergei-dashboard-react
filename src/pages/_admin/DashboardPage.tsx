import { useNavigate } from 'react-router-dom';
import { ROUTING } from '@/lib/routing';
import { brand } from '@/lib/brand';
import { useGetAdminSiteQuery } from '@/lib/redux/api/admin-api/site/site-queries';
import { useGetAdminHistoryQuery, type AdminHistoryEntryType } from '@/lib/redux/api/admin-api/history/history-api';
import {
  useGetAdminNotificationsQuery,
  type AdminNotificationType,
} from '@/lib/redux/api/admin-api/notifications/notifications-api';
import type { AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';
import Badge from '@/components/_admin/ui/Badge';
import Button from '@/components/_admin/ui/Button';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import { StatCard } from '@/components/_admin/StatCard';
import { NotifyItem } from '@/components/_admin/NotifyItem';
import { RecordCard } from '@/components/_admin/RecordCard';
import Table from '@/components/_admin/ui/Table';
import { IdentityCell, MutedCell } from '@/components/_admin/table-cells';
import type { BadgeColor } from '@/components/_admin/ui/Badge';

const ACTIVITY_LIMIT = 4;
const NOTIFICATIONS_LIMIT = 3;

const fmt = (n: number | null | undefined) => (typeof n === 'number' ? n.toLocaleString('en-US') : '—');

const BADGE_COLORS: BadgeColor[] = ['blue', 'gray', 'green', 'yellow', 'red'];

const badgeColor = (badge: string): BadgeColor =>
  (BADGE_COLORS as string[]).includes(badge) ? (badge as BadgeColor) : 'gray';

type Props = {
  site: AutobrandSiteType;
  activity: AdminHistoryEntryType[];
  notifications: AdminNotificationType[];
  unreadCount: number;
};

function Dashboard({ site, activity, notifications, unreadCount }: Props) {
  const navigate = useNavigate();
  const stats = site.motority_stats;
  const hiddenModels = site.hidden_model_ids?.length ?? 0;
  const modelsOnLanding =
    typeof stats?.models_count === 'number' ? stats.models_count - hiddenModels : undefined;

  return (
    <div>
      <div className="mb-4 flex gap-2 @max-mobile:flex-wrap @mobile:mb-6 @mobile:gap-3">
        <StatCard
          label="Models on Landing"
          value={fmt(modelsOnLanding)}
          sub={hiddenModels > 0 ? `${hiddenModels} hidden` : `All of ${fmt(stats?.models_count)} in catalog`}
        />
        <StatCard label="Generations" value={fmt(stats?.generations_count)} sub={`In the ${site.make?.name ?? brand.name} catalog`} />
        <StatCard
          label="Community Logbooks"
          value={fmt(stats?.total_logbooks)}
          sub={`${site.make?.name ?? brand.name} owners on Motority`}
        />
        <StatCard
          label="Pending Notifications"
          value={fmt(unreadCount)}
          sub="Require attention"
          valueStyle={unreadCount > 0 ? { color: 'var(--yellow)' } : undefined}
        />
      </div>

      <SectionCard>
        <SectionHeader
          title="Recent Activity"
          sub="Latest changes by editors"
          right={
            <Button variant="ghost" sm onClick={() => navigate(ROUTING.adminHistory)}>
              View All
            </Button>
          }
        />
        {activity.length === 0 && <p className="p-5 text-sm text-ink-3">No changes yet.</p>}
        <Table className="@max-table:hidden">
          <thead>
            <tr>
              <th>Editor</th>
              <th>Action</th>
              <th>Object</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((entry) => (
              <tr key={entry.id}>
                <IdentityCell initials={entry.editor.initials} name={entry.editor.name} />
                <td>{entry.change_type_label}</td>
                <td>
                  <Badge color={badgeColor(entry.badge)}>{entry.object}</Badge>
                </td>
                <MutedCell>{entry.time}</MutedCell>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="hidden flex-col gap-2 p-3 @max-table:flex">
          {activity.map((entry) => (
            <RecordCard
              key={entry.id}
              initials={entry.editor.initials}
              title={entry.editor.name}
              meta={entry.time}
              description={entry.change_type_label}
              badge={{ label: entry.object, color: badgeColor(entry.badge) }}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <SectionHeader
          title="Notifications"
          right={unreadCount > 0 ? <Badge color="yellow">{unreadCount} new</Badge> : undefined}
        />
        {notifications.length === 0 && <p className="p-5 text-sm text-ink-3">No notifications yet.</p>}
        {notifications.map((notification) => (
          <NotifyItem
            key={notification.id}
            read={notification.read}
            meta={notification.meta}
            onClick={() => navigate(ROUTING.adminNotifications)}
          >
            <strong>{notification.title}</strong> — {notification.body}
          </NotifyItem>
        ))}
      </SectionCard>
    </div>
  );
}

export default function DashboardPage() {
  const site = useGetAdminSiteQuery({ subdomain: brand.makeSlug });
  const history = useGetAdminHistoryQuery({ subdomain: brand.makeSlug });
  const notifications = useGetAdminNotificationsQuery({ subdomain: brand.makeSlug });

  const failed = [site, history, notifications].find((q) => q.isError && !q.data);
  if (failed) return <ErrorState error={failed.error} isRetrying={failed.isFetching} onRetry={failed.refetch} />;
  if (!site.data || !history.data || !notifications.data) return <Spinner />;

  return (
    <Dashboard
      site={site.data}
      activity={history.data.items.slice(0, ACTIVITY_LIMIT)}
      notifications={notifications.data.items.slice(0, NOTIFICATIONS_LIMIT)}
      unreadCount={notifications.data.unread_count}
    />
  );
}
