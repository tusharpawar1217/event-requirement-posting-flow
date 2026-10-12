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
    <nav className="bg-dark-900 border-b-4 border-starlit">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="text-2xl font-black text-starlit hover:text-primary-300 transition uppercase tracking-wider">
              EVENTFLOW
            </a>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <a 
              href="/browse" 
              className="px-4 py-2 text-gray-300 hover:text-starlit hover:bg-dark-800 transition font-bold uppercase tracking-wide text-sm border-2 border-transparent hover:border-dark-600"
            >
              Browse
            </a>
            {user && (
              <a 
                href="/post" 
                className="px-4 py-2 text-gray-300 hover:text-starlit hover:bg-dark-800 transition font-bold uppercase tracking-wide text-sm border-2 border-transparent hover:border-dark-600"
              >
                Post
              </a>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {loading ? (
              <div className="w-8 h-8 border-2 border-starlit border-t-transparent animate-spin"></div>
            ) : user ? (
              <>
                {/* User Info */}
                <div className="hidden sm:flex items-center space-x-3 bg-dark-800 border-2 border-dark-600 px-4 py-2">
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-200 uppercase">{user.name}</div>
                    <div className="text-xs font-mono text-starlit">{ROLE_LABELS[user.role]}</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white font-bold uppercase text-sm border-2 border-red-600 hover:bg-transparent hover:text-red-600 transition"
                >
                  Exit
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <a
                  href="/login"
                  className="px-4 py-2 bg-transparent text-starlit font-bold uppercase text-sm border-2 border-starlit hover:bg-starlit hover:text-cosmic transition"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="px-4 py-2 bg-starlit text-cosmic font-bold uppercase text-sm border-2 border-starlit hover:bg-transparent hover:text-starlit transition"
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
