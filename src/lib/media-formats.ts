export type MediaFormatKind = 'image' | 'video' | 'logo' | 'favicon';

/**
 * Allowed upload formats per media kind, react-dropzone accept-map shaped
 * ({mime: [extensions]}). image/video mirror the main frontend's TUS
 * restrictions; logo/favicon confirmed by backend 2026-08-25 (no server-side
 * validation — product allows all listed; webp/ico/svg pass TUS + register,
 * but get no resized variants, and svg is currently served with a wrong
 * Content-Type so it won't render in <img> until the file-service fixes it).
 */
export const MEDIA_FORMATS: Record<MediaFormatKind, Record<string, string[]>> = {
  image: {
    'image/jpeg': ['.jpeg', '.jpg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
  },
  video: {
    'video/mp4': ['.mp4'],
    'video/webm': ['.webm'],
    'video/ogg': ['.ogg'],
    'video/quicktime': ['.mov'],
  },
  logo: {
    'image/png': ['.png'],
    'image/svg+xml': ['.svg'],
    'image/webp': ['.webp'],
  },
  favicon: {
    'image/x-icon': ['.ico'],
    'image/vnd.microsoft.icon': ['.ico'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg'],
    'image/webp': ['.webp'],
  },
};

export const acceptMap = (kinds: MediaFormatKind[]): Record<string, string[]> =>
  kinds.reduce((acc, kind) => ({ ...acc, ...MEDIA_FORMATS[kind] }), {});

export const acceptAttr = (kinds: MediaFormatKind[]) =>
  Object.entries(acceptMap(kinds))
    .flatMap(([mime, exts]) => [mime, ...exts])
    .join(',');

export const isAcceptedFile = (file: File, kinds: MediaFormatKind[]) => {
  const map = acceptMap(kinds);
  return (
    file.type in map || Object.values(map).some((exts) => exts.some((ext) => file.name.toLowerCase().endsWith(ext)))
  );
};
