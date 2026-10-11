'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ROLE_COLORS = {
  admin: 'bg-purple-100 text-purple-800',
  client: 'bg-blue-100 text-blue-800',
  planner: 'bg-green-100 text-green-800',
  performer: 'bg-pink-100 text-pink-800',
  crew: 'bg-orange-100 text-orange-800'
};

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  return (
    <nav className="bg-dark-800/80 backdrop-blur-sm shadow-xl border-b border-dark-600/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold bg-gradient-to-r from-starlit to-moonstone bg-clip-text text-transparent hover:opacity-80 transition">
              EventFlow
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/browse" className="text-gray-300 hover:text-starlit transition font-medium">
              Browse Requirements
            </a>
            {user && (
              <a href="/post" className="text-gray-300 hover:text-starlit transition font-medium">
                Post Requirement
              </a>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-8 border-2 border-starlit border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* User Badge */}
                <div className="flex items-center space-x-2 bg-dark-700/50 rounded-full px-4 py-2 border border-dark-600">
                  <div className="w-8 h-8 bg-gradient-to-br from-starlit to-moonstone rounded-full flex items-center justify-center text-cosmic font-semibold">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-100">{user.name}</div>
                    <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${ROLE_COLORS[user.role] || 'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition border border-red-500/30 hover:border-red-500/50"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-starlit transition"
                >
                  Sign In
                </a>
                <a
                  href="/register"
                  className="btn-primary text-sm"
                >
                  Sign Up
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
