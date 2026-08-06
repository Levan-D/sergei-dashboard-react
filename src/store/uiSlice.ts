import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ModalName =
  'add-model' | 'edit-gen' | 'invite-user' | 'edit-role' | 'pick-media' | 'import-specs' | 'add-gen';

type UiState = {
  theme: 'dark' | 'light';
  modal: ModalName | null;
  toast: { id: number; icon: string; text: string; visible: boolean } | null;
};

const initialState: UiState = {
  theme: 'dark',
  modal: null,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    openModal(state, action: PayloadAction<ModalName>) {
      state.modal = action.payload;
    },
    closeModal(state) {
      state.modal = null;
    },
    showToast(state, action: PayloadAction<string>) {
      const m = action.payload.match(/^(\S+)\s(.+)$/);
      state.toast = {
        id: (state.toast?.id ?? 0) + 1,
        icon: m ? m[1] : 'ℹ️',
        text: m ? m[2] : action.payload,
        visible: true,
      };
    },
    hideToast(state) {
      if (state.toast) state.toast.visible = false;
    },
  },
});

export const { toggleTheme, openModal, closeModal, showToast, hideToast } = uiSlice.actions;
export default uiSlice.reducer;
