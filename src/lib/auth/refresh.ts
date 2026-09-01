import { store } from '@/store';
import { sessionEnded, sessionRenewed } from '@/store/authSlice';
import { sessionFromResponse, type LoginResponseType } from '@/lib/auth/session';

/**
 * `transient` is deliberately separate from `auth_failure`: a network blip must
 * not log the user out, only a refusal from the server should.
 */
export type RefreshResultType = 'success' | 'auth_failure' | 'transient_failure';

const REFRESH_URL = '/api/token/refresh';

const baseUrl = import.meta.env.VITE_API_URL ?? 'https://backend.motority.com';

let inFlight: Promise<RefreshResultType> | null = null;

async function requestRefresh(refreshToken: string): Promise<RefreshResultType> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${REFRESH_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    return 'transient_failure';
  }

  if (!response.ok) {
    // 4xx means the refresh token itself is rejected, so the session is done.
    // 5xx is the server's problem and the session may still be fine.
    return response.status >= 400 && response.status < 500 ? 'auth_failure' : 'transient_failure';
  }

  let body: LoginResponseType;
  try {
    body = (await response.json()) as LoginResponseType;
  } catch {
    return 'transient_failure';
  }

  const session = sessionFromResponse(body);
  if (!session) return 'auth_failure';

  store.dispatch(sessionRenewed(session));
  return 'success';
}

/**
 * Refresh the access token, collapsing concurrent callers onto one request.
 * Several queries failing with 401 at the same moment must not fire several
 * refreshes, because each one rotates the refresh token and invalidates the rest.
 */
export function ensureRefreshed(): Promise<RefreshResultType> {
  if (inFlight) return inFlight;

  const refreshToken = store.getState().auth.session?.refreshToken;
  if (!refreshToken) return Promise.resolve('auth_failure');

  inFlight = requestRefresh(refreshToken).finally(() => {
    inFlight = null;
  });
  return inFlight;
}

/** Drop the session locally. There is no server-side logout endpoint. */
export function endSession() {
  store.dispatch(sessionEnded());
}
