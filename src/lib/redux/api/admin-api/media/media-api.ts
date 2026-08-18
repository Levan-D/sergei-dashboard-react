import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminListResponseType,
  type AdminMediaKindType,
  type AdminMediaType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Brand media library (MOTORITY-4201). Files are uploaded through the existing
 * TUS flow first; this API only registers, lists and removes the resulting
 * FileInfo against the brand. Kinds are image, video and logo — there is no
 * font kind, so Brand Style's custom font upload has nowhere to go.
 *
 * Nothing here attaches an asset to a model or generation; 4200 does not
 * describe an image field on either.
 */
export type GetAdminMediaArgType = {
  subdomain: string;
  kind?: AdminMediaKindType;
};

export type RegisterAdminMediaArgType = {
  subdomain: string;
  file: number | string;
  kind?: AdminMediaKindType;
};

export type DeleteAdminMediaArgType = {
  subdomain: string;
  id: number | string;
};

export const mediaApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMedia: builder.query<AdminListResponseType<AdminMediaType>, GetAdminMediaArgType>({
      query: ({ subdomain, kind }) => `/api/autobrands/${subdomain}/media${kind ? `?kind=${kind}` : ''}`,
      transformResponse: (
        response: { data: AdminListResponseType<AdminMediaType> } | AdminListResponseType<AdminMediaType>,
      ) => unwrapData(response),
      providesTags: (_result, _error, { subdomain, kind }) => [
        { type: 'adminMedia', id: `${subdomain}:${kind ?? 'all'}` },
      ],
    }),

    /** Registers an already-uploaded FileInfo into the library. Same file twice returns 409. */
    registerAdminMedia: builder.mutation<AdminMediaType, RegisterAdminMediaArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/media`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminMediaType } | AdminMediaType) => unwrapData(response),
    }),

    deleteAdminMedia: builder.mutation<void, DeleteAdminMediaArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/media/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const { useGetAdminMediaQuery, useRegisterAdminMediaMutation, useDeleteAdminMediaMutation } = mediaApi;
