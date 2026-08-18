import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/redux/api/base-query';

/**
 * Base slice for the brand admin (epic MOTORITY-4194). Owns the reducerPath and
 * tagTypes only — every endpoint is injected from a feature file so the tag
 * registry and the cache stay shared across features.
 *
 * All endpoints under /api/autobrands/* are staff-gated. See base-query for the
 * dev token holder.
 */
export const adminApiSlice = createApi({
  reducerPath: 'adminApi',
  baseQuery,
  tagTypes: [
    'adminSite',
    'adminMe',
    'adminCatalogModels',
    'adminCatalogGenerations',
    'adminMedia',
    'adminStaff',
    'adminNotifications',
    'adminHistory',
  ],
  endpoints: () => ({}),
});
