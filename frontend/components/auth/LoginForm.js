"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { safeNext } from "@/lib/roles";
import toast from "react-hot-toast";

export default function LoginForm() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);

  // Fix A: already logged in -> never show the form
  useEffect(() => {
    if (!loading && user) {
      const redirectTo = safeNext(next, user.role);
      router.replace(redirectTo);
    }
  }, [loading, user, next, router]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setBusy(true);
    try {
      const user = await login(formData.email.trim(), formData.password);
      toast.success("Login successful!");
      const redirectTo = safeNext(next, user.role);
      router.replace(redirectTo);
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  // Don't show form if already logged in or still loading
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="you@example.com"
              required
              disabled={busy}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="••••••••"
              required
              disabled={busy}
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {busy ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
