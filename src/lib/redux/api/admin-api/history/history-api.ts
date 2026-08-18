import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminHistoryEntryType,
  type AdminListResponseType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Version History (MOTORITY-4203). Snapshots of the whole CMS payload — hero,
 * filters, community, brand_style, hidden ids, about/facts — so restore rolls
 * back the site, not a single object. Restoring about/facts also writes back
 * through to the catalog Make.
 *
 * Feeds both the History screen and the Dashboard's Recent Activity table,
 * which is the same data with a smaller page.
 */
export type GetAdminHistoryArgType = {
  subdomain: string;
  page?: number;
};

export type CreateAdminBackupArgType = { subdomain: string };

export type RestoreAdminVersionArgType = {
  subdomain: string;
  id: number | string;
};

export const historyApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminHistory: builder.query<AdminListResponseType<AdminHistoryEntryType>, GetAdminHistoryArgType>({
      query: ({ subdomain, page }) => `/api/autobrands/${subdomain}/history${page ? `?page=${page}` : ''}`,
      transformResponse: (
        response: { data: AdminListResponseType<AdminHistoryEntryType> } | AdminListResponseType<AdminHistoryEntryType>,
      ) => unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminHistory', id: subdomain }],
    }),

    /** Settings → Create Backup. Takes a manual snapshot of the current payload. */
    createAdminBackup: builder.mutation<AdminHistoryEntryType, CreateAdminBackupArgType>({
      query: ({ subdomain }) => ({
        url: `/api/autobrands/${subdomain}/history`,
        method: 'POST',
      }),
      transformResponse: (response: { data: AdminHistoryEntryType } | AdminHistoryEntryType) => unwrapData(response),
    }),

    restoreAdminVersion: builder.mutation<void, RestoreAdminVersionArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/history/${id}/restore`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetAdminHistoryQuery, useCreateAdminBackupMutation, useRestoreAdminVersionMutation } = historyApi;
