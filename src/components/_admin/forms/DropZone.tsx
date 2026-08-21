import { useDropzone, type FileRejection } from 'react-dropzone';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';

export type DropZoneKind = 'image' | 'video';

const KIND_ACCEPT: Record<DropZoneKind, Record<string, string[]>> = {
  image: {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  video: {
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
  },
};

type Props = {
  onFiles: (files: File[]) => void;
  kinds?: DropZoneKind[];
  maxFiles?: number;
  maxSizeMB?: number;
  icon: string;
  text: string;
  hint?: string;
  compact?: boolean;
  className?: string;
};

export default function DropZone({
  onFiles,
  kinds = ['image'],
  maxFiles = 1,
  maxSizeMB = 5,
  icon,
  text,
  hint,
  compact,
  className,
}: Props) {
  const accept = kinds.reduce<Record<string, string[]>>((acc, k) => ({ ...acc, ...KIND_ACCEPT[k] }), {});

  const onDrop = (accepted: File[], rejections: FileRejection[]) => {
    for (const rejection of rejections) {
      const code = rejection.errors[0]?.code;
      if (code === 'file-too-large') showToast(`⚠️ ${rejection.file.name} is over ${maxSizeMB}MB`);
      else if (code === 'file-invalid-type') showToast(`⚠️ ${rejection.file.name} — unsupported file type`);
      else if (code === 'too-many-files') showToast(`⚠️ Up to ${maxFiles} file${maxFiles > 1 ? 's' : ''} at a time`);
      else showToast(`⚠️ ${rejection.file.name} was rejected`);
    }
    if (accepted.length) onFiles(accepted.slice(0, maxFiles));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple: maxFiles > 1,
    maxSize: maxSizeMB * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          'min-w-[180px] flex-1 cursor-pointer rounded-card border-2 border-dashed text-center transition-all',
          isDragActive ? 'border-accent bg-accent-bg' : 'border-line-2 hover:border-accent hover:bg-accent-bg',
          compact ? 'p-3 @mobile:p-4' : 'px-5 py-3 @mobile:py-4',
          className,
        ),
      })}
    >
      <input {...getInputProps()} />
      <span className={cn('mb-2 block', compact ? 'text-lg' : 'text-[28px]')}>{icon}</span>
      <span className="block text-[13px] text-ink-2">{isDragActive ? 'Drop here…' : text}</span>
      {hint && <span className="mt-1 block text-[11px] text-ink-3">{hint}</span>}
    </div>
  );
}
