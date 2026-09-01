import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { store } from '@/store';
import { ensureRefreshed, endSession } from '@/lib/auth/refresh';

const baseUrl = import.meta.env.VITE_API_URL ?? 'https://backend.motority.com';

/**
 * Headers for anything that talks to the API. Reads the token straight from the
 * store so it also works outside React, which `lib/tus.ts` needs for Uppy.
 */
export const authHeaders = () => {
  const headers: Record<string, string> = { 'Accept-Language': 'en' };
  const token = store.getState().auth.session?.accessToken;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    for (const [key, value] of Object.entries(authHeaders())) headers.set(key, value);
    return headers;
  },
});

/**
 * The backend answers an expired token with 401, and sometimes reports 401 in
 * the envelope while the body carries a different code, so the message is
 * checked too.
 */
function isExpiredTokenError(error?: FetchBaseQueryError) {
  if (!error) return false;
  if (error.status === 401 || error.status === 419) return true;
  const data = 'data' in error ? (error.data as { message?: string } | string | undefined) : undefined;
  const message = typeof data === 'string' ? data : (data?.message ?? '');
  return message.toLowerCase().includes('token expired');
}

/**
 * Wraps every request: on an expired token it refreshes once, then replays.
 * A refused refresh ends the session, a transient one leaves it alone so the
 * caller can surface a normal error and the user keeps their session.
 */
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (!isExpiredTokenError(result.error)) return result;
  if (!store.getState().auth.session?.refreshToken) return result;

  const refresh = await ensureRefreshed();
  if (refresh === 'transient_failure') return result;
  if (refresh === 'auth_failure') {
    endSession();
    return result;
  }

  return rawBaseQuery(args, api, extraOptions);
};
