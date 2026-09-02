'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';
import { fetchApi } from '@/lib/apiClient';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  switchDemoUser: (demoUid: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'student',
  token: null,
  isLoading: true,
  switchDemoUser: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Initial auto-login with default demo student
    const savedToken = localStorage.getItem('skillbridge_token');
    if (savedToken) {
      setToken(savedToken);
      fetchApi<{ user: UserProfile }>('/auth/me')
        .then((res) => {
          if (res.user) {
            setUser(res.user);
            setRole(res.user.role);
          }
        })
        .catch(() => {
          switchDemoUser('std_aarav');
        })
        .finally(() => setIsLoading(false));
    } else {
      switchDemoUser('std_aarav').finally(() => setIsLoading(false));
    }
  }, []);

  const switchDemoUser = async (demoUid: string) => {
    setIsLoading(true);
    try {
      const data = await fetchApi<{ token: string; user: UserProfile }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ demoUid }),
      });

      localStorage.setItem('skillbridge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
    } catch (err) {
      console.error('Failed to switch demo user:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isLoading, switchDemoUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
