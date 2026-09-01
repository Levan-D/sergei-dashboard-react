import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearStoredSession, writeStoredSession } from '@/lib/auth/session';
import { sessionEnded, sessionRenewed, sessionStarted } from '@/store/authSlice';
import { adminApiSlice } from '@/lib/redux/api/admin-api';
import { autobrandApiSlice } from '@/lib/redux/api/landing-api/autobrand-api/autobrand-api-slice';
import { catalogApiSlice } from '@/lib/redux/api/landing-api/catalog-api/catalog-api-slice';

/**
 * Persists auth to the cookie. Reducers stay pure and no caller has to remember
 * to write storage: logging in, refreshing and logging out are the only three
 * events that change a session, and all three land here.
 */
export const authListener = createListenerMiddleware();

authListener.startListening({
  actionCreator: sessionStarted,
  effect: (action) => {
    writeStoredSession(action.payload);
  },
});

authListener.startListening({
  actionCreator: sessionRenewed,
  effect: (action) => {
    writeStoredSession(action.payload);
  },
});

/**
 * The single teardown. A session can end three ways: the user signs out, the
 * boot check finds a refresh token the server refuses, or a request 401s and
 * the refresh behind it is refused. All three dispatch `sessionEnded`, so the
 * cookie and every cached response are dropped here rather than at each call
 * site, where an expiry path would otherwise leave the previous user's data in
 * the cache for whoever signs in next on this browser.
 */
authListener.startListening({
  actionCreator: sessionEnded,
  effect: (_action, api) => {
    clearStoredSession();
    api.dispatch(adminApiSlice.util.resetApiState());
    api.dispatch(autobrandApiSlice.util.resetApiState());
    api.dispatch(catalogApiSlice.util.resetApiState());
  },
});
