import { useState } from 'react';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import useInfiniteScroll from '@/hooks/use-infinite-scroll';
import {
  useGetAdminHistoryQuery,
  useRestoreAdminVersionMutation,
  type AdminHistoryEntryType,
} from '@/lib/redux/api/admin-api/history/history-api';
import Badge from '@/components/_admin/ui/Badge';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import ConfirmModal from '@/components/_admin/ConfirmModal';
import type { BadgeColor } from '@/components/_admin/ui/Badge';
import Table from '@/components/_admin/ui/Table';
import { RecordCard } from '@/components/_admin/RecordCard';
import { IdentityCell, MutedCell } from '@/components/_admin/table-cells';

const BADGE_COLORS: BadgeColor[] = ['blue', 'gray', 'green', 'yellow', 'red'];

const badgeColor = (badge: string): BadgeColor =>
  (BADGE_COLORS as string[]).includes(badge) ? (badge as BadgeColor) : 'gray';

type RestoreButtonProps = { onClick: () => void };

function RestoreButton({ onClick }: RestoreButtonProps) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer border-none bg-transparent font-sans text-xs font-semibold text-accent hover:underline"
    >
      Restore
    </button>
  );
}

type Props = {
  entries: AdminHistoryEntryType[];
  total: number;
  hasMore: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
};

function HistoryList({ entries, total, hasMore, isFetching, onLoadMore }: Props) {
  const [restoreTarget, setRestoreTarget] = useState<AdminHistoryEntryType | null>(null);
  const [restoreVersion, { isLoading: isRestoring }] = useRestoreAdminVersionMutation();

  const visible = entries;
  const sentinelRef = useInfiniteScroll({ hasMore, isFetching, onLoadMore });

  const confirmRestore = async () => {
    if (!restoreTarget) return;
    try {
      await restoreVersion({ subdomain: brand.makeSlug, id: restoreTarget.id }).unwrap();
      showToast('♻️ Restored to this version');
      setRestoreTarget(null);
    } catch {
      showToast('⚠️ Could not restore this version');
    }
  };

  return (
    <SectionCard>
      <SectionHeader title="Version History" sub={`${total} change${total !== 1 ? 's' : ''}`} />
      <Table className="@max-table:hidden">
        <thead>
          <tr>
            <th>Editor</th>
            <th>Object</th>
            <th>Change Type</th>
            <th>Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {visible.map((entry) => (
            <tr key={entry.id}>
              <IdentityCell initials={entry.editor.initials} name={entry.editor.name} />
              <td>{entry.object}</td>
              <td>
                <Badge color={badgeColor(entry.badge)}>{entry.change_type_label}</Badge>
              </td>
              <MutedCell>{entry.time}</MutedCell>
              <td>
                <RestoreButton onClick={() => setRestoreTarget(entry)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="hidden flex-col gap-2 p-3 @max-table:flex">
        {visible.map((entry) => (
          <RecordCard
            key={entry.id}
            initials={entry.editor.initials}
            title={entry.editor.name}
            meta={entry.time}
            description={entry.object}
            badge={{ label: entry.change_type_label, color: badgeColor(entry.badge) }}
            action={<RestoreButton onClick={() => setRestoreTarget(entry)} />}
          />
        ))}
      </div>
      {hasMore && (
        <div ref={sentinelRef}>
          <Spinner className="py-6" />
        </div>
      )}
      <ConfirmModal
        open={restoreTarget !== null}
        title="Are you sure you want to restore to this version?"
        description="Existing data will get overridden."
        actionLabel="Restore"
        loading={isRestoring}
        onConfirm={confirmRestore}
        onClose={() => setRestoreTarget(null)}
      />
    </SectionCard>
  );
}

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isError, error, isFetching, refetch } = useGetAdminHistoryQuery({
    subdomain: brand.makeSlug,
    page,
  });

  if (isError && !data) return <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />;
  if (!data) return <Spinner />;
  return (
    <HistoryList
      entries={data.items}
      total={data.total}
      hasMore={data.current_page < data.last_page}
      isFetching={isFetching}
      onLoadMore={() => setPage((p) => p + 1)}
    />
  );
}
