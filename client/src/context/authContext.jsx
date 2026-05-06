import { useMemo, useState } from 'react';
import { clearStoredToken, setStoredToken } from '../routes/api';
import { loginRequest, registerRequest } from '../routes/authService';
import { AuthContext } from './authContextValue';

const USER_STORAGE_KEY = 'rolling-commerce-user';

const readStoredUser = () => {
  try {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const data = await loginRequest(credentials);
      setStoredToken(data.token);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } catch (requestError) {
      setError(requestError.message || 'Could not log in.');
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
      setError(requestError.message || 'Could not create account.');
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearStoredToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
