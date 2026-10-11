'use client';

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 relative">
      {/* Cosmic stars effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-starlit rounded-full top-[20%] left-[15%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-moonstone rounded-full top-[40%] right-[20%] animate-pulse delay-100"></div>
        <div className="absolute w-1 h-1 bg-starlit rounded-full bottom-[30%] left-[25%] animate-pulse delay-200"></div>
        <div className="absolute w-2 h-2 bg-starlit/50 rounded-full top-[60%] right-[30%] animate-pulse"></div>
      </div>

      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <div className="mb-8 inline-block">
          <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 via-moonstone to-starlit rounded-2xl flex items-center justify-center shadow-2xl mb-6 mx-auto border border-starlit/30">
            <svg className="w-12 h-12 text-cosmic" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-starlit via-moonstone to-starlit bg-clip-text text-transparent">
          Requirement Posting Flow
        </h1>
        
        <p className="text-xl mb-10 text-gray-400 max-w-2xl mx-auto">
          Post your event requirements for planners, performers, or crew members with our easy-to-use wizard
        </p>
        
        {!loading && (
          <div className="flex gap-4 justify-center items-center">
            {user ? (
              <>
                <Link
                  href="/post"
                  className="btn-primary inline-block"
                >
                  Post a Requirement
                </Link>
                <Link
                  href="/browse"
                  className="px-6 py-3 rounded-lg font-semibold border-2 border-starlit/30 text-starlit hover:bg-starlit/10 transition-all duration-300"
                >
                  Browse Requirements
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="btn-primary inline-block"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-lg font-semibold border-2 border-starlit/30 text-starlit hover:bg-starlit/10 transition-all duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        )}
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link href="/browse?category=planner" className="card p-6 hover:shadow-2xl hover:border-starlit/50 transition-all duration-300 group cursor-pointer">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">📋</div>
            <h3 className="font-bold text-lg text-starlit mb-2">Event Planners</h3>
            <p className="text-gray-400 text-sm">Find professional planners for your special events</p>
          </Link>
          
          <Link href="/browse?category=performer" className="card p-6 hover:shadow-2xl hover:border-moonstone/50 transition-all duration-300 group cursor-pointer">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">🎤</div>
            <h3 className="font-bold text-lg text-moonstone mb-2">Performers</h3>
            <p className="text-gray-400 text-sm">Book talented performers for any occasion</p>
          </Link>
          
          <Link href="/browse?category=crew" className="card p-6 hover:shadow-2xl hover:border-starlit/50 transition-all duration-300 group cursor-pointer">
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">👷</div>
            <h3 className="font-bold text-lg text-starlit mb-2">Crew Members</h3>
            <p className="text-gray-400 text-sm">Hire experienced crew for your events</p>
          </Link>
        </div>
      </div>
    </main>
  );
}
