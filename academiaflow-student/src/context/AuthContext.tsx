import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('af_token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const u = localStorage.getItem('af_user');
    return u ? JSON.parse(u) : null;
  });

  const setAuth = (t: string, u: AuthUser) => {
    localStorage.setItem('af_token', t);
    localStorage.setItem('af_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const clearAuth = () => {
    localStorage.removeItem('af_token');
    localStorage.removeItem('af_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, clearAuth, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
