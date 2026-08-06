import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import ui from './uiSlice';
import catalog from '@/features/catalog/catalogSlice';
import landing from '@/features/landing/landingSlice';
import specs from '@/features/specs/specsSlice';

export const store = configureStore({
  reducer: { ui, catalog, landing, specs },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
