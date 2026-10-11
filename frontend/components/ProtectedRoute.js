"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = user && (!roles || roles.includes(user.role));

  useEffect(() => {
    if (loading) return; // Do nothing until /auth/me resolves
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!allowed) {
      router.replace("/");
    }
  }, [loading, user, allowed, router, pathname]);

  if (loading || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
