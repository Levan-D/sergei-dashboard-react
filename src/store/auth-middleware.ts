import { createListenerMiddleware } from '@reduxjs/toolkit';
import { clearStoredSession, writeStoredSession } from '@/lib/auth/session';
import { sessionEnded, sessionRenewed, sessionStarted } from '@/store/authSlice';

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

authListener.startListening({
  actionCreator: sessionEnded,
  effect: () => {
    clearStoredSession();
  },
});
