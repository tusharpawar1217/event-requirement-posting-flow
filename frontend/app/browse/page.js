"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function BrowseContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") || "planner";
  
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = {
    planner: { name: "Event Planners", icon: "📋", color: "starlit" },
    performer: { name: "Performers", icon: "🎤", color: "moonstone" },
    crew: { name: "Crew Members", icon: "👷", color: "starlit" }
  };

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/requirements?category=${category}`
      );
      if (!response.ok) throw new Error("Failed to fetch requirements");
      const data = await response.json();
      setRequirements(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const currentCategory = categories[category];

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-moonstone hover:text-starlit transition-colors mb-4 inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{currentCategory.icon}</div>
            <div>
              <h1 className={`text-4xl font-bold text-${currentCategory.color}`}>
                {currentCategory.name}
              </h1>
              <p className="text-gray-400 mt-2">Browse available requirements</p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 border-b border-dark-600 pb-1">
          {Object.entries(categories).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => router.push(`/browse?category=${key}`)}
              className={`px-6 py-3 rounded-t-lg transition-all ${
                category === key
                  ? `bg-${cat.color}/20 text-${cat.color} border-b-2 border-${cat.color}`
                  : "text-gray-400 hover:text-gray-300 hover:bg-dark-700"
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-starlit border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading requirements...</p>
          </div>
        )}

        {error && (
          <div className="card p-6 border-red-500/50 bg-red-500/10">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {!loading && !error && requirements.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-400">No requirements found for this category</p>
          </div>
        )}

        {!loading && !error && requirements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requirements.map((req) => (
              <div key={req._id} className="card p-6 hover:shadow-2xl hover:border-starlit/50 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-starlit">{req.eventName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${currentCategory.color}/20 text-${currentCategory.color}`}>
                    {req.category}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-moonstone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(req.eventDate)}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-moonstone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{req.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-moonstone" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>${req.budget?.toLocaleString()}</span>
                  </div>
                </div>

                {req.description && (
                  <p className="text-gray-400 text-sm mt-4 line-clamp-2">{req.description}</p>
                )}

                {/* Category-specific fields */}
                {category === "planner" && req.eventType && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <span className="text-xs text-gray-500">Event Type: </span>
                    <span className="text-sm text-moonstone">{req.eventType}</span>
                  </div>
                )}

                {category === "performer" && req.performanceType && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <span className="text-xs text-gray-500">Performance Type: </span>
                    <span className="text-sm text-moonstone">{req.performanceType}</span>
                  </div>
                )}

                {category === "crew" && req.crewRole && (
                  <div className="mt-4 pt-4 border-t border-dark-600">
                    <span className="text-xs text-gray-500">Crew Role: </span>
                    <span className="text-sm text-moonstone">{req.crewRole}</span>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500">
                  Posted {formatDate(req.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-starlit border-t-transparent"></div>
      </div>
    }>
      <BrowseContent />
    </Suspense>
  );
}
