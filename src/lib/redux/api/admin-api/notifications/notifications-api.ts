import { adminApiSlice } from '@/lib/redux/api/admin-api/admin-api-slice';
import { unwrapData } from '@/lib/redux/api/admin-api/admin-types';

export type AdminNotificationType = {
  id: number;
  type: string;
  surface: string;
  surface_label: string;
  title: string;
  body: string;
  meta: string;
  read: boolean;
  payload: Record<string, unknown> | unknown[];
  created_at: string;
};

export type AdminNotificationsResponseType = {
  items: AdminNotificationType[];
  count: number;
  total: number;
  current_page: number;
  last_page: number;
  unread_count: number;
};

export type GetAdminNotificationsArgType = {
  subdomain: string;
  page?: number;
  perPage?: number;
  unreadOnly?: boolean;
};

export type SendAdminNotificationArgType = {
  subdomain: string;
  title: string;
  body: string;
};

export type ReadAdminNotificationArgType = {
  subdomain: string;
  id: number | string;
};

export type ReadAllAdminNotificationsArgType = { subdomain: string };

/**
 * Brand admin inbox (MOTORITY-4202) — separate from FCM push and from the
 * app's /api/v2/me/interactions feed. Read state is per user, and unread_count
 * drives both the sidebar badge and the Dashboard card.
 *
 * The backend also writes entries here itself: creating a model or generation,
 * and saving hero or style, each add a card. `payload` is a keyed object when
 * present and an empty array when not.
 *
 * Server-side pagination landed by 2026-08-27 (the 08-21 note saying otherwise
 * is obsolete): `page`, `per-page` and `unread=1` all work, and the response
 * carries total / current_page / last_page. Pages are merged into one cache
 * entry so the list grows as the sentinel pulls more.
 */
const NOTIFICATIONS_PER_PAGE = 20;

export const notificationsApi = adminApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminNotifications: builder.query<AdminNotificationsResponseType, GetAdminNotificationsArgType>({
      query: ({ subdomain, page = 1, perPage = NOTIFICATIONS_PER_PAGE, unreadOnly }) =>
        `/api/autobrands/${subdomain}/notifications?page=${page}&per-page=${perPage}${unreadOnly ? '&unread=1' : ''}`,
      transformResponse: (response: { data: AdminNotificationsResponseType } | AdminNotificationsResponseType) =>
        unwrapData(response),
      serializeQueryArgs: ({ queryArgs: { subdomain, unreadOnly } }) => ({ subdomain, unreadOnly }),
      merge: (cache, incoming) => {
        if (incoming.current_page <= 1) return incoming;
        const seen = new Set(cache.items.map((i) => i.id));
        cache.items.push(...incoming.items.filter((i) => !seen.has(i.id)));
        cache.count = cache.items.length;
        cache.total = incoming.total;
        cache.current_page = incoming.current_page;
        cache.last_page = incoming.last_page;
        cache.unread_count = incoming.unread_count;
      },
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.page !== previousArg?.page,
      providesTags: (_result, _error, { subdomain }) => [{ type: 'adminNotifications', id: subdomain }],
    }),

    sendAdminNotification: builder.mutation<AdminNotificationType, SendAdminNotificationArgType>({
      query: ({ subdomain, ...body }) => ({
        url: `/api/autobrands/${subdomain}/notifications`,
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: AdminNotificationType } | AdminNotificationType) => unwrapData(response),
    }),

    readAdminNotification: builder.mutation<void, ReadAdminNotificationArgType>({
      query: ({ subdomain, id }) => ({
        url: `/api/autobrands/${subdomain}/notifications/${id}/read`,
        method: 'POST',
      }),
    }),

    readAllAdminNotifications: builder.mutation<void, ReadAllAdminNotificationsArgType>({
      query: ({ subdomain }) => ({
        url: `/api/autobrands/${subdomain}/notifications/read-all`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAdminNotificationsQuery,
  useSendAdminNotificationMutation,
  useReadAdminNotificationMutation,
  useReadAllAdminNotificationsMutation,
} = notificationsApi;
