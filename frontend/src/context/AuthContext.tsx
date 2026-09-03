'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';
import { fetchApi } from '@/lib/apiClient';

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  institutionName?: string;
  department?: string;
  careerGoal?: string;
  companyName?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  token: string | null;
  isLoading: boolean;
  switchDemoUser: (demoUid: string) => Promise<void>;
  registerUser: (payload: RegisterPayload) => Promise<UserProfile>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'student',
  token: null,
  isLoading: true,
  switchDemoUser: async () => {},
  registerUser: async () => ({} as UserProfile),
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('student');
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
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
          localStorage.removeItem('skillbridge_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
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

  const registerUser = async (payload: RegisterPayload): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const data = await fetchApi<{ token: string; user: UserProfile }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      localStorage.setItem('skillbridge_token', data.token);
      setToken(data.token);
      setUser(data.user);
      setRole(data.user.role);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('skillbridge_token');
    setUser(null);
    setToken(null);
    setRole('student');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, isLoading, switchDemoUser, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
