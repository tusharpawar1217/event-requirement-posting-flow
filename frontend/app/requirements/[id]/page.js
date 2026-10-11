"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function RequirementDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [requirement, setRequirement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchRequirement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchRequirement = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/requirements/${id}`);
      setRequirement(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || "Failed to load requirement");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this requirement?")) return;
    
    setDeleting(true);
    try {
      await api.delete(`/requirements/${id}`);
      toast.success("Requirement deleted successfully");
      router.push("/browse");
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Failed to delete");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/requirements/${id}/edit`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return timeString;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-starlit border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading requirement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cosmic">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-starlit mb-2">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link href="/browse" className="btn-primary inline-block">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cosmic">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-starlit mb-2">Not Found</h2>
          <p className="text-gray-400 mb-6">This requirement does not exist</p>
          <Link href="/browse" className="btn-primary inline-block">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = user && user._id === requirement.postedBy;
  const isAdmin = user && user.role === 'admin';
  const canEdit = isOwner || isAdmin;

  const categoryIcons = {
    planner: "📋",
    performer: "🎭",
    crew: "🔧"
  };

  return (
    <main className="min-h-screen py-12 px-4 relative bg-cosmic">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-starlit rounded-full top-[10%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-moonstone rounded-full top-[20%] right-[15%] animate-pulse delay-100"></div>
        <div className="absolute w-2 h-2 bg-starlit/50 rounded-full bottom-[20%] left-[20%] animate-pulse delay-200"></div>
        <div className="absolute w-1 h-1 bg-moonstone/70 rounded-full top-[70%] right-[25%] animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-moonstone hover:text-starlit mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse
        </Link>

        {/* Main Card */}
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-secondary-600 via-secondary-500 to-primary-500 p-8 border-b border-starlit/30">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{categoryIcons[requirement.category]}</span>
                  <span className="px-3 py-1 bg-dark-800/60 backdrop-blur-sm rounded-full text-sm font-medium text-starlit border border-starlit/30">
                    {requirement.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-white">{requirement.eventName}</h1>
                {requirement.description && (
                  <p className="text-gray-200">{requirement.description}</p>
                )}
              </div>
              
              {canEdit && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-dark-700 text-starlit rounded-lg font-semibold hover:bg-dark-600 transition border border-starlit/50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-500/90 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Basic Info */}
            <section>
              <h2 className="text-xl font-bold text-starlit mb-4 flex items-center gap-2">
                <span className="text-2xl">📅</span>
                Event Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 bg-dark-800/30 p-4 rounded-lg border border-dark-600/50">
                  <svg className="w-6 h-6 text-primary-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Event Date</div>
                    <div className="font-semibold text-gray-200">{formatDate(requirement.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-dark-800/30 p-4 rounded-lg border border-dark-600/50">
                  <svg className="w-6 h-6 text-primary-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Event Time</div>
                    <div className="font-semibold text-gray-200">{formatTime(requirement.eventTime)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-dark-800/30 p-4 rounded-lg border border-dark-600/50">
                  <svg className="w-6 h-6 text-primary-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Location</div>
                    <div className="font-semibold text-gray-200">{requirement.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-dark-800/30 p-4 rounded-lg border border-dark-600/50">
                  <svg className="w-6 h-6 text-primary-300 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Budget</div>
                    <div className="font-semibold text-gray-200">${requirement.budget?.toLocaleString() || "Not specified"}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Category-Specific Details */}
            {requirement.category === "planner" && (
              <section>
                <h2 className="text-xl font-bold text-starlit mb-4 flex items-center gap-2">
                  <span className="text-2xl">📋</span>
                  Planning Details
                </h2>
                <div className="bg-dark-800/50 rounded-lg p-6 space-y-4 border border-starlit/20">
                  <div className="flex justify-between items-center py-2 border-b border-dark-600">
                    <span className="text-sm text-gray-400">Event Type</span>
                    <span className="font-semibold text-primary-300">{requirement.eventType || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dark-600">
                    <span className="text-sm text-gray-400">Expected Guests</span>
                    <span className="font-semibold text-primary-300">{requirement.guestCount || "Not specified"}</span>
                  </div>
                  {requirement.venuePreference && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Venue Preference</span>
                      <span className="font-semibold text-primary-300">{requirement.venuePreference}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {requirement.category === "performer" && (
              <section>
                <h2 className="text-xl font-bold text-starlit mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎭</span>
                  Performance Details
                </h2>
                <div className="bg-dark-800/50 rounded-lg p-6 space-y-4 border border-starlit/20">
                  <div className="flex justify-between items-center py-2 border-b border-dark-600">
                    <span className="text-sm text-gray-400">Performance Type</span>
                    <span className="font-semibold text-primary-300">{requirement.performanceType || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dark-600">
                    <span className="text-sm text-gray-400">Duration</span>
                    <span className="font-semibold text-primary-300">{requirement.duration || "Not specified"}</span>
                  </div>
                  {requirement.equipment && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Equipment Provided</span>
                      <span className="font-semibold text-primary-300">{requirement.equipment}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {requirement.category === "crew" && (
              <section>
                <h2 className="text-xl font-bold text-starlit mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔧</span>
                  Crew Details
                </h2>
                <div className="bg-dark-800/50 rounded-lg p-6 space-y-4 border border-starlit/20">
                  <div className="flex justify-between items-center py-2 border-b border-dark-600">
                    <span className="text-sm text-gray-400">Crew Role</span>
                    <span className="font-semibold text-primary-300">{requirement.crewRole || "Not specified"}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-dark-600">
                    <span className="text-sm text-gray-400">Number Required</span>
                    <span className="font-semibold text-primary-300">{requirement.numberOfCrew || "Not specified"}</span>
                  </div>
                  {requirement.shiftTiming && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-400">Shift Timing</span>
                      <span className="font-semibold text-primary-300">{requirement.shiftTiming}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Additional Requirements */}
            {requirement.additionalRequirements && (
              <section>
                <h2 className="text-xl font-bold text-starlit mb-4 flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  Additional Requirements
                </h2>
                <div className="bg-dark-800/50 rounded-lg p-6 border border-starlit/20">
                  <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{requirement.additionalRequirements}</p>
                </div>
              </section>
            )}

            {/* Posted Info */}
            <section className="border-t border-dark-600 pt-6">
              <div className="text-sm text-gray-500">
                Posted on {formatDate(requirement.createdAt)}
                {requirement.updatedAt !== requirement.createdAt && (
                  <span> • Updated {formatDate(requirement.updatedAt)}</span>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
