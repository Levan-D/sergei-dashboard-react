import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import { authHeaders } from '@/lib/redux/api/base-query';

const TUS_URL = import.meta.env.VITE_TUS_URL ?? 'https://testing-images.motority.com';

export type TusMediaType = 'image' | 'video';

export const tusMediaType = (file: File): TusMediaType => (file.type.startsWith('video') ? 'video' : 'image');

/**
 * Same upload flow as the main frontend's images-api (Uppy + tus, 5MB chunks).
 * Resolves to the file ids the backend knows the uploads by — the last path
 * segment of each uploadURL, in the same order as the input files. Omit
 * mediaType to derive it per file from the mime type.
 */
export async function uploadFilesTus(
  files: File[],
  mediaType?: TusMediaType,
  onProgress?: (percent: number) => void,
  onFileProgress?: (index: number, percent: number) => void,
): Promise<string[]> {
  const uppy = new Uppy().use(Tus, {
    endpoint: TUS_URL,
    headers: authHeaders(),
    limit: 4,
    chunkSize: 5 * 1024 * 1024,
  });

  const addedIds = files.map((file) =>
    uppy.addFile({
      name: `${file.name}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: file.type,
      data: file,
      meta: { media_type: mediaType ?? tusMediaType(file) },
    }),
  );

  uppy.on('upload-progress', (file, progress) => {
    if (!progress.bytesTotal) return;
    const percent = Math.round((progress.bytesUploaded / progress.bytesTotal) * 100);
    if (onProgress) onProgress(percent);
    if (onFileProgress && file) {
      const index = addedIds.indexOf(file.id);
      if (index !== -1) onFileProgress(index, percent);
    }
  });

  const result = await uppy.upload();
  const successful = result?.successful ?? [];
  const failed = result?.failed ?? [];
  if (successful.length !== files.length || failed.length) throw new Error('TUS upload failed');

  return addedIds.map((addedId) => {
    const uploaded = successful.find((f) => f.id === addedId);
    const parts = (uploaded?.uploadURL ?? '').split('/');
    return parts[parts.length - 1];
  });
}
