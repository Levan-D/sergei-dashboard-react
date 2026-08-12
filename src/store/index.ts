import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import { catalogApiSlice } from '@/lib/redux/api/catalog-api/catalog-api-slice';
import catalog from '@/features/_admin/catalog/catalogSlice';
import landing from '@/features/_admin/landing/landingSlice';
import specs from '@/features/_admin/specs/specsSlice';
import screen from './screenSlice';

export const store = configureStore({
  reducer: { catalog, landing, specs, screen, [catalogApiSlice.reducerPath]: catalogApiSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(catalogApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
