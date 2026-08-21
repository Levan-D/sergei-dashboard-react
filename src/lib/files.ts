export type LocalFileType = { file: File; url: string };

export const toLocalFile = (file: File): LocalFileType => ({ file, url: URL.createObjectURL(file) });

export const releaseLocalFile = (local: LocalFileType | null | undefined) => {
  if (local) URL.revokeObjectURL(local.url);
};

export const fmtFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
