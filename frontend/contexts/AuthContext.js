"use client";
import { createContext, useContext } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AuthContext = createContext();

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetcher for SWR
const fetcher = async (url) => {
  try {
    const response = await api.get(url);
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return null; // Not authenticated
    }
    throw error;
  }
};

export function AuthProvider({ children }) {
  const router = useRouter();
  
  // SWR hook for current user
  const { data: user, error, mutate, isLoading } = useSWR('/auth/me', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: false
  });

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    await mutate(response.data.data);
    return response.data;
  };

  const register = async (data) => {
    const response = await api.post('/auth/register', data);
    await mutate(response.data.data);
    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    await mutate(null, false);
    router.push('/');
  };

  const value = {
    user,
    error,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    mutate
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Axios interceptor for global 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Redirect to login if not already there
      if (!window.location.pathname.startsWith('/login')) {
        const next = encodeURIComponent(window.location.pathname);
        window.location.href = `/login?next=${next}`;
      }
    }
    return Promise.reject(error);
  }
);

export { api };
