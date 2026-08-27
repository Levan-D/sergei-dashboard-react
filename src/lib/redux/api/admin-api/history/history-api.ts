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
  total: number;
  current_page: number;
  last_page: number;
};

export type GetAdminHistoryArgType = { subdomain: string; page?: number; perPage?: number };

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
 * Server-side pagination landed by 2026-08-27 (the 08-21 note saying otherwise
 * is obsolete): `page` and `per-page` work and the response carries total /
 * current_page / last_page. Pages merge into one cache entry.
 */
const HISTORY_PER_PAGE = 20;

export const historyApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminHistory: builder.query<AdminHistoryResponseType, GetAdminHistoryArgType>({
      query: ({ subdomain, page = 1, perPage = HISTORY_PER_PAGE }) =>
        `/api/autobrands/${subdomain}/history?page=${page}&per-page=${perPage}`,
      transformResponse: (response: { data: AdminHistoryResponseType } | AdminHistoryResponseType) =>
        unwrapData(response),
      serializeQueryArgs: ({ queryArgs: { subdomain } }) => ({ subdomain }),
      merge: (cache, incoming) => {
        if (incoming.current_page <= 1) return incoming;
        const seen = new Set(cache.items.map((i) => i.id));
        cache.items.push(...incoming.items.filter((i) => !seen.has(i.id)));
        cache.count = cache.items.length;
        cache.total = incoming.total;
        cache.current_page = incoming.current_page;
        cache.last_page = incoming.last_page;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
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
