   import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminListResponseType,
  type AdminMeItemType,
  type AutobrandSiteType,
} from '@/lib/redux/api/admin-api/admin-types';

export type GetAdminSiteArgType = { subdomain: string };

export const siteQueriesApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * The whole brand CMS payload in one read — hero, about, facts, filters,
     * hidden model/generation ids, community, brand_style and settings.
     * Seeds every screen under Landing Page, Brand Style, Community, Settings.
     * MOTORITY-4193
     */
    getAdminSite: builder.query<AutobrandSiteType, GetAdminSiteArgType>({
      query: ({ subdomain }) => `/api/autobrands/${subdomain}`,
      transformResponse: (response: { data: AutobrandSiteType } | AutobrandSiteType) => unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminSite', id: subdomain }],
    }),

    /**
     * Which brands the signed-in user is staff on, and with which role.
     * Returns an empty items array for a valid token with no staff record.
     * Use it to pick the active subdomain and to gate superadmin-only UI.
     * MOTORITY-4193
     */
    getAdminMe: builder.query<AdminListResponseType<AdminMeItemType>, void>({
      query: () => '/api/autobrands/me',
      transformResponse: (
        response: { data: AdminListResponseType<AdminMeItemType> } | AdminListResponseType<AdminMeItemType>,
      ) => unwrapData(response),
      providesTags: () => [{ type: 'adminMe', id: 'LIST' }],
    }),
  }),
});

export const { useGetAdminSiteQuery, useGetAdminMeQuery } = siteQueriesApi;
