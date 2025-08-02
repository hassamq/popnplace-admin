import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { CONFIG } from 'src/config-global';
import axios, { endpoints } from 'src/utils/axios';

import { STORAGE_KEY } from './constant';
import { AuthContext } from '../auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = sessionStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // If no server URL is configured, use mock user data
        if (!CONFIG.serverUrl) {
          const mockUser = {
            id: '8864c717-587d-472a-929a-8e5f298024da-0',
            displayName: 'PopnPlace Admin',
            email: 'admin@popnplace.com',
            photoURL: '/logo/logo-single.png',
            phoneNumber: '+1 555-123-4567',
            country: 'United States',
            address: '123 Parking St',
            state: 'California',
            city: 'San Francisco',
            zipCode: '94116',
            about: 'PopnPlace parking management administrator',
            role: 'admin',
            isPublic: true,
          };
          setState({ user: { ...mockUser, accessToken }, loading: false });
          return;
        }

        const res = await axios.get(endpoints.auth.me);

        const { user } = res.data;

        setState({ user: { ...user, accessToken }, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
