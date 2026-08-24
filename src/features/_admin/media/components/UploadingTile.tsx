import CircularLoader from '@/components/_admin/ui/CircularLoader';

type Props = {
  name: string;
  previewUrl: string;
  progress: number;
  video?: boolean;
};

export default function UploadingTile({ name, previewUrl, progress, video }: Props) {
  return (
    <div className="relative overflow-hidden rounded-el border border-line bg-surface-2">
      {video ? (
        <video src={previewUrl} preload="metadata" muted className="block h-20 w-full scale-110 object-cover opacity-60 blur-[2px]" />
      ) : (
        <span
          className="block h-20 w-full scale-110 bg-cover bg-center opacity-60 blur-[2px]"
          style={{ backgroundImage: `url("${previewUrl}")` }}
        />
      )}
      <span className="absolute inset-x-0 top-0 flex h-20 items-center justify-center">
        <CircularLoader progress={progress} />
      </span>
      <span className="block px-2.5 py-2">
        <span className="block overflow-hidden text-xs font-semibold text-ellipsis whitespace-nowrap text-ink">
          {name}
        </span>
        <span className="block text-[11px] text-ink-3">Uploading · {Math.round(progress)}%</span>
      </span>
    </div>
  );
}
