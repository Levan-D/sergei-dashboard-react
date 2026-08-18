import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from '@/lib/redux/api/base-query';
import { unwrapData, type AutobrandSiteType } from '@/lib/redux/api/admin-api/admin-types';

/**
 * Public, unauthenticated brand landing API (MOTORITY-4195, 4193). Kept apart
 * from adminApi because it is what the landing itself calls.
 *
 * resolveAutobrandHost is what replaces the hardcoded placeholder in lib/brand.ts
 * once subdomains are live.
 */
export type ResolveAutobrandHostArgType = { host: string };

export type ResolveAutobrandHostType = {
  subdomain: string;
  domain?: string | null;
  name?: string | null;
};

export type GetPublicAutobrandArgType = { subdomain: string };

export const autobrandApiSlice = createApi({
  reducerPath: 'autobrandApi',
  baseQuery,
  tagTypes: ['publicAutobrand', 'autobrandHost'],
  endpoints: (builder) => ({
    resolveAutobrandHost: builder.query<ResolveAutobrandHostType, ResolveAutobrandHostArgType>({
      query: ({ host }) => `/api/v3/public/autobrands/resolve?host=${encodeURIComponent(host)}`,
      transformResponse: (response: { data: ResolveAutobrandHostType } | ResolveAutobrandHostType) =>
        unwrapData(response),
      providesTags: (_result, _error, { host }) => [{ type: 'autobrandHost', id: host }],
    }),

    getPublicAutobrand: builder.query<AutobrandSiteType, GetPublicAutobrandArgType>({
      query: ({ subdomain }) => `/api/v3/public/autobrands/${subdomain}`,
      transformResponse: (response: { data: AutobrandSiteType } | AutobrandSiteType) => unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'publicAutobrand', id: subdomain }],
    }),
  }),
});

export const { useResolveAutobrandHostQuery, useGetPublicAutobrandQuery } = autobrandApiSlice;
