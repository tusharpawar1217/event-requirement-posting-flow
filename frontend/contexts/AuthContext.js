"use client";
import { createContext, useContext, useEffect, useCallback } from "react";
import useSWR from "swr";
import api from "@/lib/api";

const AuthContext = createContext(null);

// 401 on /auth/me means "not logged in", which is not an error
const fetchMe = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data.data;
  } catch (e) {
    if (e.response?.status === 401) return null;
    throw e;
  }
};

export function AuthProvider({ children }) {
  const { data, isLoading, mutate } = useSWR("/auth/me", fetchMe, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const login = useCallback(
    async (email, password) => {
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.data;
      await mutate(user, { revalidate: false });
      return user;
    },
    [mutate]
  );

  const register = useCallback(
    async (data) => {
      const res = await api.post("/auth/register", data);
      const user = res.data.data;
      await mutate(user, { revalidate: false });
      return user;
    },
    [mutate]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      await mutate(null, { revalidate: false });
    }
  }, [mutate]);

  useEffect(() => {
    const onExpired = () => mutate(null, { revalidate: false });
    window.addEventListener("auth:expired", onExpired);
    return () => window.removeEventListener("auth:expired", onExpired);
  }, [mutate]);

  const value = {
    user: data ?? null,
    loading: isLoading,
    isAuthenticated: !!data,
    login,
    register,
    logout,
    refresh: mutate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
