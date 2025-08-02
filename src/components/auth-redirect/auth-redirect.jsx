import { Navigate } from 'react-router-dom';

import { useAuthContext } from 'src/auth/hooks';

import { CONFIG } from 'src/config-global';
import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export function AuthRedirect() {
  const { user, status } = useAuthContext();

  // Show loading screen while checking authentication
  if (status === 'loading') {
    return <SplashScreen />;
  }

  // If user is authenticated, redirect to dashboard
  if (status === 'authenticated' && user) {
    return <Navigate to={CONFIG.auth.redirectPath} replace />;
  }

  // If user is not authenticated, redirect to login
  return <Navigate to="/auth/jwt/sign-in" replace />;
}
