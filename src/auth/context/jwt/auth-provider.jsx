import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { CONFIG } from 'src/config-global';
import { authService } from 'src/services/api';

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
      // Use localStorage for persistent token storage
      const accessToken = localStorage.getItem(STORAGE_KEY);

      if (accessToken && isValidToken(accessToken)) {
        setSession(accessToken);

        // If no server URL is configured, use mock user data
        if (!CONFIG.serverUrl) {
          const mockUser = {
            id: '8864c717-587d-472a-929a-8e5f298024da-0',
            displayName: 'PopnPlace Admin',
            firstName: 'PopnPlace',
            lastName: 'Admin',
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
            notifications: {
              email: {
                bookings: true,
                messages: true,
                marketing: false,
              },
              sms: {
                bookings: true,
                messages: false,
              },
            },
          };
          setState({ user: { ...mockUser, accessToken }, loading: false });
          return;
        }

        try {
          const userData = await authService.getProfile();
          setState({ user: { ...userData, accessToken }, loading: false });
        } catch (error) {
          console.error('Failed to get user profile:', error);
          // Clear invalid token
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
          setState({ user: null, loading: false });
        }
      } else {
        // Clear invalid token
        if (accessToken) {
          localStorage.removeItem(STORAGE_KEY);
          setSession(null);
        }
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      // Clear any invalid token
      localStorage.removeItem(STORAGE_KEY);
      setSession(null);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await authService.login({ email, password });

        const { accessToken, user } = response;

        if (!accessToken) {
          throw new Error('Access token not found in response');
        }

        // Format user data to match the expected structure
        const formattedUser = {
          id: user._id,
          displayName: `${user.firstName} ${user.lastName}`,
          email: user.email,
          photoURL: user.profilePicture,
          phoneNumber: user.phoneNumber,
          country: user.address?.country,
          address: user.address?.street,
          state: user.address?.state,
          city: user.address?.city,
          zipCode: user.address?.zipCode,
          role: user.role,
          isPublic: true,
          // Add additional user data
          firstName: user.firstName,
          lastName: user.lastName,
          isVerified: user.isVerified,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt,
          // Include nested objects
          emailVerification: user.emailVerification,
          idVerification: user.idVerification,
          hostProfile: user.hostProfile,
          renterProfile: user.renterProfile,
          notifications: user.notifications || {
            email: {
              bookings: true,
              messages: true,
              marketing: false,
            },
            sms: {
              bookings: true,
              messages: false,
            },
          },
        };

        // Store token in localStorage for persistence
        setSession(accessToken);
        localStorage.setItem(STORAGE_KEY, accessToken);

        setState({ user: { ...formattedUser, accessToken }, loading: false });

        return { success: true, user: { ...formattedUser, accessToken } };
      } catch (error) {
        console.error('Login failed:', error);
        return { success: false, error: error.message || 'Login failed' };
      }
    },
    [setState]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token from localStorage
      setSession(null);
      localStorage.removeItem(STORAGE_KEY);
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
      login,
      logout,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, login, logout, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
