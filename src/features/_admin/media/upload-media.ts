import { store } from '@/store';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { releaseLocalFile, toLocalFile } from '@/lib/files';
import { uploadFilesTus } from '@/lib/tus';
import { mediaKindForFile } from '@/lib/media-formats';
import { mediaApi } from '@/lib/redux/api/admin-api/media/media-api';
import { finishUploads, setUploadProgress, startUploads } from '@/store/uploadsSlice';

let uploadCounter = 0;

type RegisterOutcomeType = 'added' | 'duplicate' | 'failed';

const isConflict = (error: unknown) =>
  typeof error === 'object' && error !== null && (error as { status?: number }).status === 409;

/** One line summarising a batch: what landed, what was already there, what broke. */
const outcomeToast = (added: number, duplicates: number, failed: number) => {
  const files = (n: number) => `${n} file${n === 1 ? '' : 's'}`;
  if (failed) return `⚠️ ${files(failed)} could not be uploaded`;
  if (!duplicates) return `✅ ${files(added)} uploaded`;
  if (!added) return duplicates === 1 ? 'ℹ️ Already in the library' : `ℹ️ ${files(duplicates)} already in the library`;
  return `✅ ${files(added)} uploaded · ${duplicates} already in the library`;
};

/**
 * Runs the whole upload pipeline (TUS → register → cache insert) against the
 * store directly, outside any component lifetime — navigating away from the
 * Media page mid-upload changes nothing, and the placeholders are waiting in
 * the uploads slice when the user comes back.
 */
export async function uploadToLibrary(files: File[]) {
  if (!files.length) return;

  const locals = files.map(toLocalFile);
  const keys = locals.map((local) => `upload-${uploadCounter++}-${local.file.name}`);
  store.dispatch(
    startUploads(
      locals.map((local, i) => ({
        key: keys[i],
        name: local.file.name,
        previewUrl: local.url,
        video: local.file.type.startsWith('video'),
        progress: 0,
      })),
    ),
  );

  try {
    const fileIds = await uploadFilesTus(files, undefined, undefined, (index, percent) =>
      store.dispatch(setUploadProgress({ key: keys[index], progress: percent })),
    );
    const tally: Record<RegisterOutcomeType, number> = { added: 0, duplicate: 0, failed: 0 };
    for (const [i, fileId] of fileIds.entries()) {
      const outcome: RegisterOutcomeType = await store
        .dispatch(
          mediaApi.endpoints.registerAdminMedia.initiate({
            subdomain: brand.makeSlug,
            file_id: fileId,
            name: files[i].name,
            kind: mediaKindForFile(files[i]),
          }),
        )
        .unwrap()
        .then((): RegisterOutcomeType => 'added')
        .catch((error): RegisterOutcomeType => (isConflict(error) ? 'duplicate' : 'failed'));
      tally[outcome] += 1;
      // A duplicate is already in the library, so its placeholder has nothing left to wait for.
      if (outcome !== 'failed') store.dispatch(finishUploads([keys[i]]));
    }
    showToast(outcomeToast(tally.added, tally.duplicate, tally.failed));
  } catch {
    showToast('⚠️ Upload failed, please try again');
  } finally {
    locals.forEach(releaseLocalFile);
    store.dispatch(finishUploads(keys));
  }
}
