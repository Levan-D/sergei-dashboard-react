import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import { unwrapData } from '@/lib/redux/api/admin-api/admin-types';

export type AdminHistoryEditorType = {
  id: number;
  name: string;
  initials: string;
};

export type AdminHistoryEntryType = {
  id: number;
  editor: AdminHistoryEditorType;
  object: string;
  change_type: string;
  change_type_label: string;
  badge: string;
  time: string;
  created_at: string;
  snapshot: unknown;
};

export type AdminHistoryResponseType = {
  items: AdminHistoryEntryType[];
  count: number;
};

export type GetAdminHistoryArgType = { subdomain: string };

export type CreateAdminBackupArgType = { subdomain: string };

export type RestoreAdminVersionArgType = {
  subdomain: string;
  id: number | string;
};

/**
 * Version History (MOTORITY-4203). Snapshots of the whole CMS payload — hero,
 * filters, community, brand_style, hidden ids, about/facts — so restore rolls
 * back the site, not a single object. Restoring about/facts also writes back
 * through to the catalog Make.
 *
 * Feeds both the History screen and the Dashboard's Recent Activity table.
 * `time` and `badge` come preformatted from the server; `snapshot` is null in
 * the list payload.
 *
 * Verified 2026-08-21: the list endpoint ignores page / per-page / limit and
 * always returns everything — server-side pagination does not exist yet.
 */
export const historyApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminHistory: builder.query<AdminHistoryResponseType, GetAdminHistoryArgType>({
      query: ({ subdomain }) => `/api/autobrands/${subdomain}/history`,
      transformResponse: (response: { data: AdminHistoryResponseType } | AdminHistoryResponseType) =>
        unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminHistory', id: subdomain }],
    }),

    /** Settings → Create Backup. Takes a manual snapshot of the current payload. */
    createAdminBackup: builder.mutation<AdminHistoryEntryType, CreateAdminBackupArgType>({
      query: ({ subdomain }) => ({
        url: `/api/autobrands/${subdomain}/history`,
        method: 'POST',
      }),
      transformResponse: (response: { data: AdminHistoryEntryType } | AdminHistoryEntryType) => unwrapData(response),
      invalidatesTags: (_result, _error, { subdomain }) => [{ type: 'adminHistory', id: subdomain }],
    }),

    /**
     * Verified 2026-08-21: each history entry is a FULL snapshot of the site
     * payload taken right after its change — restoring rolls the ENTIRE config
     * back to that moment, not just the labeled object. Hence both tags: the
     * whole site payload changes, so every form must refetch.
     */
    restoreAdminVersion: builder.mutation<void, RestoreAdminVersionArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/history/${id}/restore`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, { subdomain }) => [
        { type: 'adminHistory', id: subdomain },
        { type: 'adminSite', id: subdomain },
      ],
    }),
  }),
});

export const { useGetAdminHistoryQuery, useCreateAdminBackupMutation, useRestoreAdminVersionMutation } = historyApi;
