import { useDropzone, type FileRejection } from 'react-dropzone';
import { showToast } from '@/lib/toast';
import { cn } from '@/lib/cn';
import { acceptMap, type MediaFormatKind } from '@/lib/media-formats';

export type DropZoneKind = MediaFormatKind;

type Props = {
  onFiles: (files: File[]) => void;
  kinds?: DropZoneKind[];
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
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
  disabled,
  icon,
  text,
  hint,
  compact,
  className,
}: Props) {
  const accept = acceptMap(kinds);

  const onDrop = (accepted: File[], rejections: FileRejection[]) => {
    // Dropping more than maxFiles rejects the whole batch, so recover those and
    // take the first maxFiles instead. The caller reports its own limit.
    const isOverflowOnly = (r: FileRejection) => r.errors.every((e) => e.code === 'too-many-files');
    const overflow = rejections.filter(isOverflowOnly).map((r) => r.file);

    for (const rejection of rejections.filter((r) => !isOverflowOnly(r))) {
      const code = rejection.errors[0]?.code;
      if (code === 'file-too-large') showToast(`⚠️ ${rejection.file.name} is over ${maxSizeMB}MB`);
      else if (code === 'file-invalid-type') showToast(`⚠️ ${rejection.file.name} — unsupported file type`);
      else showToast(`⚠️ ${rejection.file.name} was rejected`);
    }

    const usable = [...accepted, ...overflow].slice(0, maxFiles);
    if (usable.length) onFiles(usable);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    multiple: maxFiles > 1,
    maxSize: maxSizeMB * 1024 * 1024,
    disabled,
  });

  return (
    <div
      {...getRootProps({
        className: cn(
          'min-w-[180px] flex-1 cursor-pointer rounded-card border-2 border-dashed text-center transition-all',
          isDragActive ? 'border-accent bg-accent-bg' : 'border-line-2 hover:border-accent hover:bg-accent-bg',
          compact ? 'p-3 @mobile:p-4' : 'px-5 py-3 @mobile:py-4',
          disabled && 'cursor-not-allowed opacity-50 hover:border-line-2 hover:bg-transparent',
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
