import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/v1",
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    // Never redirect from here. Just tell the AuthProvider the session died.
    if (status === 401 && !url.startsWith("/auth/") && typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth:expired"));
    }
    return Promise.reject(err);
  }
);

export default api;
