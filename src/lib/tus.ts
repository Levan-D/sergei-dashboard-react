import Uppy from '@uppy/core';
import Tus from '@uppy/tus';
import { authHeaders } from '@/lib/redux/api/base-query';

const TUS_URL = import.meta.env.VITE_TUS_URL ?? 'https://testing-images.motority.com';

export type TusMediaType = 'image' | 'video';

/**
 * Same upload flow as the main frontend's images-api (Uppy + tus, 5MB chunks).
 * Resolves to the file ids the backend knows the uploads by — the last path
 * segment of each uploadURL.
 */
export async function uploadFilesTus(
  files: File[],
  mediaType: TusMediaType = 'image',
  onProgress?: (percent: number) => void,
): Promise<string[]> {
  const uppy = new Uppy().use(Tus, {
    endpoint: TUS_URL,
    headers: authHeaders(),
    limit: 4,
    chunkSize: 5 * 1024 * 1024,
  });

  for (const file of files) {
    uppy.addFile({
      name: `${encodeURIComponent(file.name)}-${Math.floor(1000 + Math.random() * 9000)}`,
      type: file.type,
      data: file,
      meta: { media_type: mediaType },
    });
  }

  uppy.on('upload-progress', (_file, progress) => {
    if (onProgress && progress.bytesTotal) {
      onProgress(Math.round((progress.bytesUploaded / progress.bytesTotal) * 100));
    }
  });

  const result = await uppy.upload();
  const successful = result?.successful ?? [];
  const failed = result?.failed ?? [];
  if (!successful.length || failed.length) throw new Error('TUS upload failed');

  return successful.map((f) => {
    const parts = (f.uploadURL ?? '').split('/');
    return parts[parts.length - 1];
  });
}
