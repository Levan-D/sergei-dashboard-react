import { useState } from 'react';
import { cn } from '@/lib/cn';
import { brand } from '@/lib/brand';
import { useGetAdminMediaQuery } from '@/lib/redux/api/admin-api/media/media-api';
import { adminMediaUrl, type AdminMediaKindType, type AdminMediaType } from '@/lib/redux/api/admin-api/admin-types';
import Modal from '@/components/_admin/Modal';
import Button from '@/components/_admin/ui/Button';
import Chip from '@/components/_admin/ui/Chip';
import Spinner from '@/components/_admin/ui/Spinner';
import ErrorState from '@/components/_admin/ui/ErrorState';
import { IconImage } from '@/components/_admin/icons';
import { isVideoMedia, mediaKindOf } from './MediaGallery';

const FILTERS: { label: string; kind?: AdminMediaKindType }[] = [
  { label: 'All' },
  { label: 'Images', kind: 'image' },
  { label: 'Videos', kind: 'video' },
];

type Props = {
  open: boolean;
  onClose: () => void;
  onPick?: (media: AdminMediaType) => void;
  kinds?: AdminMediaKindType[];
  multiple?: boolean;
  onPickMany?: (media: AdminMediaType[]) => void;
};

export default function PickMediaModal({ open, onClose, onPick, kinds, multiple, onPickMany }: Props) {
  const [selectedIds, setSelectedIds] = useState<Array<AdminMediaType['id']>>([]);
  const [filter, setFilter] = useState<AdminMediaKindType | undefined>();
  const { data, isError, error, isFetching, refetch } = useGetAdminMediaQuery(
    { subdomain: brand.makeSlug },
    { skip: !open },
  );

  const close = () => {
    setSelectedIds([]);
    setFilter(undefined);
    onClose();
  };

  const toggleSelected = (id: AdminMediaType['id']) => {
    if (!multiple) {
      setSelectedIds([id]);
      return;
    }
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const allowed = (data?.items ?? []).filter((m) => !kinds || kinds.includes(mediaKindOf(m)));
  const items = filter ? allowed.filter((m) => mediaKindOf(m) === filter) : allowed;
  const selected = allowed.filter((m) => selectedIds.includes(m.id));
  const showFilters = !kinds || kinds.length > 1;

  const footerLabel = !selected.length
    ? multiple
      ? 'No files selected'
      : 'No file selected'
    : multiple
      ? `${selected.length} file${selected.length === 1 ? '' : 's'} selected`
      : `Selected: ${selected[0].name ?? selected[0].id}`;

  return (
    <Modal
      open={open}
      onClose={close}
      title="Media Library"
      sub={multiple ? 'Select files to insert' : 'Select a file to insert'}
      width={680}
      footer={
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-ink-3">
            <IconImage size={13} />
            {footerLabel}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={close}>
              Cancel
            </Button>
            <Button
              disabled={!selected.length}
              onClick={() => {
                if (!selected.length) return;
                close();
                if (multiple) onPickMany?.(selected);
                else onPick?.(selected[0]);
              }}
            >
              Choose
            </Button>
          </div>
        </div>
      }
    >
      {showFilters && (
        <div className="flex gap-2 border-b border-line px-5 py-2 @mobile:py-3">
          {FILTERS.map((f) => (
            <Chip key={f.label} label={f.label} active={filter === f.kind} onClick={() => setFilter(f.kind)} />
          ))}
        </div>
      )}
      {isError && !data ? (
        <div className="p-5">
          <ErrorState error={error} isRetrying={isFetching} onRetry={refetch} />
        </div>
      ) : !data ? (
        <Spinner className="py-10" />
      ) : items.length === 0 ? (
        <p className="p-5 text-sm text-ink-3">Nothing in the library yet — upload files on the Media Library page.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 p-5 @mobile:gap-3">
          {items.map((media) => {
            const url = adminMediaUrl(media, 'small');
            const video = isVideoMedia(media);
            return (
              <button
                type="button"
                key={media.id}
                onClick={() => toggleSelected(media.id)}
                className={cn(
                  'relative block w-full cursor-pointer overflow-hidden rounded-el border bg-surface-2 text-left transition-all',
                  selectedIds.includes(media.id)
                    ? "border-accent shadow-[0_0_0_2px_var(--accent-bg)] after:absolute after:top-1 after:right-1 after:flex after:h-[18px] after:w-[18px] after:items-center after:justify-center after:rounded-full after:bg-accent after:text-[10px] after:font-bold after:text-white after:content-['✓']"
                    : 'border-line hover:border-line-2',
                )}
              >
                {url ? (
                  <span className="block h-[90px] bg-cover bg-center" style={{ backgroundImage: `url("${url}")` }} />
                ) : (
                  <span className="flex h-[90px] items-center justify-center bg-surface-3 text-[22px]">
                    {video ? '🎬' : '🖼️'}
                  </span>
                )}
                {video && (
                  <span className="pointer-events-none absolute inset-x-0 top-0 flex h-[90px] items-center justify-center">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/60 pl-0.5 text-[10px] text-white">
                      ▶
                    </span>
                  </span>
                )}
                <span className="block px-2.5 py-2">
                  <span className="block overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-ink">
                    {media.name ?? String(media.id)}
                  </span>
                  <span className="block overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-ink-3">
                    {media.meta ?? ''}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
