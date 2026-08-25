import { useRef, useState } from 'react';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { useAppSelector } from '@/store';
import { acceptAttr, isAcceptedFile } from '@/lib/media-formats';
import { useDeleteAdminMediaMutation } from '@/lib/redux/api/admin-api/media/media-api';
import type { AdminMediaKindType, AdminMediaType } from '@/lib/redux/api/admin-api/admin-types';
import { uploadToLibrary } from './upload-media';
import Button from '@/components/_admin/ui/Button';
import Chip from '@/components/_admin/ui/Chip';
import SectionCard from '@/components/_admin/ui/SectionCard';
import SectionHeader from '@/components/_admin/ui/SectionHeader';
import ConfirmModal from '@/components/_admin/ConfirmModal';
import MediaGallery, { mediaKindOf } from './MediaGallery';
import MediaTile from './components/MediaTile';
import UploadingTile from './components/UploadingTile';

const FILTERS: { label: string; kind?: AdminMediaKindType }[] = [
  { label: 'All' },
  { label: 'Images', kind: 'image' },
  { label: 'Videos', kind: 'video' },
];

type Props = { items: AdminMediaType[] };

export default function MediaLibrary({ items }: Props) {
  const [kind, setKind] = useState<AdminMediaKindType | undefined>();
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminMediaType | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploads = useAppSelector((state) => state.uploads.active);
  const [deleteMedia] = useDeleteAdminMediaMutation();

  const visible = kind ? items.filter((m) => mediaKindOf(m) === kind) : items;
  const isUploading = uploads.length > 0;
  const galleryOpen = galleryIndex != null && galleryIndex < visible.length;

  const openDialog = () => inputRef.current?.click();

  const onPickFiles = (list: FileList | null) => {
    const picked = Array.from(list ?? []);
    if (inputRef.current) inputRef.current.value = '';
    if (!picked.length || isUploading) return;
    const files = picked.filter((f) => isAcceptedFile(f, ['image', 'video']));
    picked.filter((f) => !files.includes(f)).forEach((f) => showToast(`⚠️ ${f.name} — unsupported file type`));
    if (files.length) void uploadToLibrary(files);
  };

  const onConfirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    deleteMedia({ subdomain: brand.makeSlug, id: target.id })
      .unwrap()
      .then(() => showToast('🗑️ File deleted'))
      .catch(() => showToast('⚠️ Could not delete the file — brought it back'));
  };

  return (
    <SectionCard>
      <SectionHeader
        title="Media Library"
        sub="Brand assets — images and videos"
        right={
          <Button sm loading={isUploading} onClick={openDialog}>
            + Upload
          </Button>
        }
      />
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptAttr(['image', 'video'])}
        className="hidden"
        onChange={(e) => onPickFiles(e.target.files)}
      />
      <div className="flex gap-2 px-5 pt-3 @mobile:pt-4">
        {FILTERS.map((f) => (
          <Chip key={f.label} label={f.label} active={kind === f.kind} onClick={() => setKind(f.kind)} />
        ))}
      </div>
      {visible.length === 0 && !isUploading && (
        <p className="px-5 pt-4 text-sm text-ink-3">
          {kind ? `No ${kind} files in the library yet.` : 'The library is empty — upload your first file.'}
        </p>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 p-5 @mobile:gap-3">
        {uploads.map((u) => (
          <UploadingTile key={u.key} name={u.name} previewUrl={u.previewUrl} video={u.video} progress={u.progress} />
        ))}
        {visible.map((media, i) => (
          <MediaTile
            key={media.id}
            media={media}
            onOpen={() => setGalleryIndex(i)}
            onDelete={() => setDeleteTarget(media)}
          />
        ))}
        <button
          type="button"
          disabled={isUploading}
          onClick={openDialog}
          className="cursor-pointer overflow-hidden rounded-el border-2 border-dashed border-line bg-surface-2 transition-all hover:border-line-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="flex h-20 items-center justify-center bg-transparent text-[28px] text-ink-3">+</span>
          <span className="block px-2.5 py-2">
            <span className="block text-center text-xs font-semibold text-ink-3">Upload new</span>
          </span>
        </button>
      </div>
      {galleryOpen && (
        <MediaGallery
          items={visible}
          index={galleryIndex}
          onNavigate={setGalleryIndex}
          onClose={() => setGalleryIndex(null)}
        />
      )}
      <ConfirmModal
        open={deleteTarget != null}
        title="Delete this file?"
        description={`"${deleteTarget?.name ?? deleteTarget?.id ?? ''}" will be permanently removed from the media library.`}
        actionLabel="Delete"
        onConfirm={onConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </SectionCard>
  );
}
