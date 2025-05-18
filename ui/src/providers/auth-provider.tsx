import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../lib/api-client';

interface AuthState {
  user: string | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
    remember: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await authApi.status();
      setUser(res.data.user ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (
    username: string,
    password: string,
    remember: boolean
  ) => {
    await authApi.login({ username, password, remember_me: remember });
    await refresh();
  };

  const logout = async () => {
    await authApi.logout();
    await refresh();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
