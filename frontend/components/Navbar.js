'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const ROLE_LABELS = {
  admin: 'ADMIN',
  client: 'CLIENT',
  planner: 'PLANNER',
  performer: 'PERFORMER',
  crew: 'CREW'
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
    <nav className="bg-dark-900 border-b-2 border-starlit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-lg font-black text-starlit hover:text-primary-300 transition uppercase tracking-wider">
              EVENTFLOW
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <a 
              href="/browse" 
              className="px-3 py-1.5 text-gray-300 hover:text-starlit hover:bg-dark-800 transition font-semibold uppercase tracking-wide text-xs border border-transparent hover:border-dark-600"
            >
              Browse
            </a>
            {user && (
              <a 
                href="/post" 
                className="px-3 py-1.5 text-gray-300 hover:text-starlit hover:bg-dark-800 transition font-semibold uppercase tracking-wide text-xs border border-transparent hover:border-dark-600"
              >
                Post
              </a>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="w-6 h-6 border-2 border-starlit border-t-transparent animate-spin"></div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-2 bg-dark-800 border border-dark-600 px-3 py-1.5">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-gray-200 uppercase">{user.name}</div>
                    <div className="text-xs font-mono text-starlit opacity-75">{ROLE_LABELS[user.role]}</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 bg-red-600 text-white font-semibold uppercase text-xs border border-red-600 hover:bg-transparent hover:text-red-600 transition"
                >
                  Exit
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="px-3 py-1.5 bg-transparent text-starlit font-semibold uppercase text-xs border border-starlit hover:bg-starlit hover:text-cosmic transition"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-3 py-1.5 bg-starlit text-cosmic font-semibold uppercase text-xs border border-starlit hover:bg-transparent hover:text-starlit transition"
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
