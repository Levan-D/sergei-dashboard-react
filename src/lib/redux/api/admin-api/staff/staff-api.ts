import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import {
  unwrapData,
  type AdminListResponseType,
  type AdminStaffRoleType,
  type AdminStaffType,
} from '@/lib/redux/api/admin-api/admin-types';

/**
 * Users & Roles (MOTORITY-4199). Two roles: admin and superadmin, identical
 * content access — only superadmin may invite, edit or deactivate.
 *
 * There is no seat limit; the mock's "4 of 10 users" was dummy UI. Staff are
 * AutobrandStaff records on top of a normal Motority account, not Sonata roles,
 * and are isolated per brand — another brand's subdomain returns 403.
 * The first superadmin is created off-platform via app:autobrands:provision.
 */
export type GetAdminStaffArgType = { subdomain: string };

export type InviteAdminStaffArgType = {
  subdomain: string;
  name?: string;
  email: string;
  role: AdminStaffRoleType;
};

export type UpdateAdminStaffArgType = {
  subdomain: string;
  id: number | string;
  role: AdminStaffRoleType;
};

export type DeactivateAdminStaffArgType = {
  subdomain: string;
  id: number | string;
};

export const staffApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStaff: builder.query<AdminListResponseType<AdminStaffType>, GetAdminStaffArgType>({
      query: ({ subdomain }) => `/api/autobrands/${subdomain}/staff`,
      transformResponse: (
        response: { data: AdminListResponseType<AdminStaffType> } | AdminListResponseType<AdminStaffType>,
      ) => unwrapData(response),
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminStaff', id: subdomain }],
    }),

    /** Sends a temp-password email; the invitee changes it on first login via POST /api/public/login. */
    inviteAdminStaff: builder.mutation<AdminStaffType, InviteAdminStaffArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/staff`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminStaffType } | AdminStaffType) => unwrapData(response),
    }),

    updateAdminStaff: builder.mutation<AdminStaffType, UpdateAdminStaffArgType>({
      query: ({ subdomain, id, ...body }) => ({
        url: `/api/autobrands/${subdomain}/staff/${id}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (response: { data: AdminStaffType } | AdminStaffType) => unwrapData(response),
    }),

    deactivateAdminStaff: builder.mutation<void, DeactivateAdminStaffArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/staff/${id}/deactivate`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAdminStaffQuery,
  useInviteAdminStaffMutation,
  useUpdateAdminStaffMutation,
  useDeactivateAdminStaffMutation,
} = staffApi;
