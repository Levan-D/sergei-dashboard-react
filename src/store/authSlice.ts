import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { readStoredSession, type SessionType } from '@/lib/auth/session';

/**
 * `unknown` means a session was restored from the cookie but has not been
 * checked yet: AuthGate resolves it to authenticated or anonymous on boot,
 * refreshing first if the access token has expired.
 */
export type AuthStatusType = 'unknown' | 'authenticated' | 'anonymous';

type AuthStateType = {
  session: SessionType | null;
  status: AuthStatusType;
};

const restored = readStoredSession();

const initialState: AuthStateType = {
  session: restored,
  status: restored ? 'unknown' : 'anonymous',
};

/**
 * Auth lives in Redux so the whole app reads one source of truth. The cookie is
 * persistence only, written by auth-middleware whenever these actions fire, and
 * read once here at boot.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionStarted: (state, action: PayloadAction<SessionType>) => {
      state.session = action.payload;
      state.status = 'authenticated';
    },
    /** A refresh succeeded. Keeps the status untouched so a boot check can finish. */
    sessionRenewed: (state, action: PayloadAction<SessionType>) => {
      state.session = action.payload;
      state.status = 'authenticated';
    },
    sessionEnded: (state) => {
      state.session = null;
      state.status = 'anonymous';
    },
    /** The boot check finished and the stored session is good as-is. */
    sessionConfirmed: (state) => {
      if (state.session) state.status = 'authenticated';
    },
  },
});

export const { sessionStarted, sessionRenewed, sessionEnded, sessionConfirmed } = authSlice.actions;
export default authSlice.reducer;
