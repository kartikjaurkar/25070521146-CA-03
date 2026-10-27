import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, TOKEN_KEY } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const restoreSession = async () => {
      try {
        const data = await authService.me();
        if (isMounted) setUser(data.user);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
