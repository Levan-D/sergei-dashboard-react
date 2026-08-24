import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ActiveUploadType = {
  key: string;
  name: string;
  previewUrl: string;
  video: boolean;
  progress: number;
};

type UploadsStateType = {
  active: ActiveUploadType[];
};

const initialState: UploadsStateType = {
  active: [],
};

/**
 * Upload state lives here, not in page components, so in-flight uploads
 * survive route changes — same pattern as the main frontend's files-upload
 * slice. The orchestration that feeds it is features/_admin/media/upload-media.
 */
const uploadsSlice = createSlice({
  name: 'uploads',
  initialState,
  reducers: {
    startUploads: (state, action: PayloadAction<ActiveUploadType[]>) => {
      state.active.push(...action.payload);
    },
    setUploadProgress: (state, action: PayloadAction<{ key: string; progress: number }>) => {
      const upload = state.active.find((u) => u.key === action.payload.key);
      if (upload) upload.progress = action.payload.progress;
    },
    finishUploads: (state, action: PayloadAction<string[]>) => {
      state.active = state.active.filter((u) => !action.payload.includes(u.key));
    },
  },
});

export const { startUploads, setUploadProgress, finishUploads } = uploadsSlice.actions;
export default uploadsSlice.reducer;
