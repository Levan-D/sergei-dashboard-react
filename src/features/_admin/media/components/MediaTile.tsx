import { fmtFileSize } from '@/lib/files';
import { adminMediaUrl, type AdminMediaType } from '@/lib/redux/api/admin-api/admin-types';
import { IconTrash } from '@/components/_admin/icons';
import { isVideoMedia } from '../MediaGallery';

type Props = {
  media: AdminMediaType;
  onOpen: () => void;
  onDelete: () => void;
};

export default function MediaTile({ media, onOpen, onDelete }: Props) {
  const video = isVideoMedia(media);
  const url = adminMediaUrl(media, 'small');
  const info = media.file ?? media;
  const fallbackMeta = [
    info.width && info.height ? `${info.width}×${info.height}` : null,
    info.size ? fmtFileSize(info.size) : null,
    video ? 'Video' : media.kind === 'logo' ? 'Logo' : null,
  ].filter(Boolean);
  const meta = media.meta ?? (fallbackMeta.join(' · ') || (info.filetype ?? '—'));

  return (
    <div
      onClick={onOpen}
      className="group relative cursor-pointer overflow-hidden rounded-el border border-line bg-surface-2 text-left transition-all hover:border-line-2"
    >
      {url ? (
        <span className="block h-20 w-full bg-cover bg-center" style={{ backgroundImage: `url("${url}")` }} />
      ) : (
        <span className="flex h-20 items-center justify-center bg-surface-3 text-[22px]">
          {video ? '🎬' : media.kind === 'logo' ? '🔵' : '🖼️'}
        </span>
      )}
      {video && (
        <span className="pointer-events-none absolute inset-x-0 top-0 flex h-20 items-center justify-center">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 pl-0.5 text-[11px] text-white">
            ▶
          </span>
        </span>
      )}
      <span className="block px-2.5 py-2">
        <span className="block overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-ink">
          {media.name ?? String(media.id)}
        </span>
        <span className="block overflow-hidden text-[11px] text-ellipsis whitespace-nowrap text-ink-3">{meta}</span>
      </span>
      <button
        type="button"
        title="Delete file"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-1.5 right-1.5 flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full border-none bg-black/70 text-white opacity-0 transition-all group-hover:opacity-100 hover:bg-red"
      >
        <IconTrash size={13} />
      </button>
    </div>
  );
}
