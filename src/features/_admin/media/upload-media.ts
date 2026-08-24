import { store } from '@/store';
import { showToast } from '@/lib/toast';
import { brand } from '@/lib/brand';
import { releaseLocalFile, toLocalFile } from '@/lib/files';
import { uploadFilesTus } from '@/lib/tus';
import { mediaApi } from '@/lib/redux/api/admin-api/media/media-api';
import { finishUploads, setUploadProgress, startUploads } from '@/store/uploadsSlice';

let uploadCounter = 0;

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
    let registered = 0;
    for (const [i, fileId] of fileIds.entries()) {
      const ok = await store
        .dispatch(
          mediaApi.endpoints.registerAdminMedia.initiate({
            subdomain: brand.makeSlug,
            file_id: fileId,
            name: files[i].name,
          }),
        )
        .unwrap()
        .then(() => true)
        .catch(() => false);
      if (ok) {
        registered += 1;
        store.dispatch(finishUploads([keys[i]]));
      }
    }
    if (registered === files.length) {
      showToast(`✅ ${registered} file${registered === 1 ? '' : 's'} uploaded`);
    } else {
      showToast(`⚠️ ${registered} of ${files.length} files made it to the library`);
    }
  } catch {
    showToast('⚠️ Upload failed, please try again');
  } finally {
    locals.forEach(releaseLocalFile);
    store.dispatch(finishUploads(keys));
  }
}
