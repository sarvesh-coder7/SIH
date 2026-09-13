import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, AuthSession } from '../types/auth';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  setCurrentUser: (user: AuthUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const stored = authService.getSession();
      if (stored?.user) {
        setCurrentUser(stored.user);
        setSession(stored);
      }
    } catch (_) {}
    setIsLoading(false);
  }, []);

  // Listen for demo tour user switch events dispatched by DemoContext
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.user) {
        setCurrentUser(detail.user);
      }
    };
    window.addEventListener('demo:switchUser', handler);
    return () => window.removeEventListener('demo:switchUser', handler);
  }, []);

  const login = async (identifier: string, password?: string) => {
    const res = await authService.login(identifier, password);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      const s = authService.getSession();
      setSession(s);
    }
    return res;
  };

  const logout = () => {
    setCurrentUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, session, isLoading, login, logout, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
