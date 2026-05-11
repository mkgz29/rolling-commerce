import { useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '../routes/api';
import { loginRequest, registerRequest } from '../routes/authService';
import { AuthContext } from './authContextValue';

const USER_STORAGE_KEY = 'rolling-commerce-user';

const readStoredSession = () => {
  try {
    const storedToken = getStoredToken();
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (!storedToken || !storedUser) {
      clearStoredToken();
      localStorage.removeItem(USER_STORAGE_KEY);
      return { user: null, token: null };
    }

    return {
      user: JSON.parse(storedUser),
      token: storedToken,
    };
  } catch {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    return { user: null, token: null };
  }
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginRequest(credentials);
      setStoredToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      setSession({ user: data.user, token: data.token });
      return data.user;
    } catch (requestError) {
      setError(requestError.message || 'No pudimos iniciar sesión.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      setLoading(true);
      setError(null);
      return await registerRequest(formData);
    } catch (requestError) {
      setError(requestError.message || 'No pudimos crear la cuenta.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setSession({ user: null, token: null });
  };

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      loading,
      error,
      isAuthenticated: Boolean(session.user && session.token),
      isAdmin: session.user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [session, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
