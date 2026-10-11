'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const ROLES = [
  {
    value: 'client',
    label: 'Client',
    description: 'Post requirements and hire talent',
    icon: '👤'
  },
  {
    value: 'planner',
    label: 'Planner',
    description: 'Plan and organize events',
    icon: '📋'
  },
  {
    value: 'performer',
    label: 'Performer',
    description: 'Perform at events',
    icon: '🎭'
  },
  {
    value: 'crew',
    label: 'Crew',
    description: 'Technical and support crew',
    icon: '🔧'
  }
];

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = formData;
      await axios.post('/api/auth/register', registerData);
      
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-starlit rounded-full top-[10%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-moonstone rounded-full top-[20%] right-[15%] animate-pulse delay-100"></div>
        <div className="absolute w-2 h-2 bg-starlit/50 rounded-full bottom-[20%] left-[20%] animate-pulse delay-200"></div>
        <div className="absolute w-1 h-1 bg-moonstone/70 rounded-full top-[70%] right-[25%] animate-pulse"></div>
      </div>

      <div className="max-w-2xl mx-auto card p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 via-moonstone to-starlit rounded-2xl flex items-center justify-center shadow-2xl shadow-starlit/20 mb-4 mx-auto border border-starlit/30">
            <svg className="w-10 h-10 text-cosmic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-starlit via-moonstone to-starlit bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2">Join our event platform today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg focus:ring-2 focus:ring-starlit focus:border-transparent transition text-gray-100 placeholder-gray-500"
              placeholder="John Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg focus:ring-2 focus:ring-starlit focus:border-transparent transition text-gray-100 placeholder-gray-500"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg focus:ring-2 focus:ring-starlit focus:border-transparent transition text-gray-100 placeholder-gray-500"
              placeholder="••••••••"
              minLength={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-800/50 border border-dark-600 rounded-lg focus:ring-2 focus:ring-starlit focus:border-transparent transition text-gray-100 placeholder-gray-500"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Select Your Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              {ROLES.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleRoleSelect(role.value)}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    formData.role === role.value
                      ? 'border-starlit bg-starlit/10'
                      : 'border-dark-600 hover:border-moonstone/50 bg-dark-800/30'
                  }`}
                >
                  <div className="text-2xl mb-2">{role.icon}</div>
                  <div className="font-semibold text-gray-100">{role.label}</div>
                  <div className="text-sm text-gray-400">{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <a href="/login" className="text-starlit hover:text-primary-300 font-semibold transition">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
