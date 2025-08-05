import { useContext } from 'react';
import { AuthContext } from 'src/auth/context/auth-context';

// ----------------------------------------------------------------------

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// ----------------------------------------------------------------------

export const useAuthService = () => {
  const { login, logout, checkUserSession } = useAuth();

  return {
    login,
    logout,
    checkUserSession,
  };
};
