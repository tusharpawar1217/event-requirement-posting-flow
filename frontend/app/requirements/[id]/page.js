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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading requirement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/browse" className="btn-primary inline-block">
            Back to Browse
          </Link>
        </div>
      </div>
    );
  }

  if (!requirement) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">This requirement does not exist</p>
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Browse
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{categoryIcons[requirement.category]}</span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {requirement.category}
                  </span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{requirement.eventName}</h1>
                {requirement.description && (
                  <p className="text-blue-100">{requirement.description}</p>
                )}
              </div>
              
              {canEdit && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:opacity-50 transition"
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Event Date</div>
                    <div className="font-semibold text-gray-900">{formatDate(requirement.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Event Time</div>
                    <div className="font-semibold text-gray-900">{formatTime(requirement.eventTime)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Location</div>
                    <div className="font-semibold text-gray-900">{requirement.location}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="text-sm text-gray-500">Budget</div>
                    <div className="font-semibold text-gray-900">${requirement.budget?.toLocaleString() || "Not specified"}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Category-Specific Details */}
            {requirement.category === "planner" && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Planning Details</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Event Type: </span>
                    <span className="font-semibold text-gray-900">{requirement.eventType || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Expected Guests: </span>
                    <span className="font-semibold text-gray-900">{requirement.guestCount || "Not specified"}</span>
                  </div>
                  {requirement.venuePreference && (
                    <div>
                      <span className="text-sm text-gray-500">Venue Preference: </span>
                      <span className="font-semibold text-gray-900">{requirement.venuePreference}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {requirement.category === "performer" && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Performance Details</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Performance Type: </span>
                    <span className="font-semibold text-gray-900">{requirement.performanceType || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Duration: </span>
                    <span className="font-semibold text-gray-900">{requirement.duration || "Not specified"}</span>
                  </div>
                  {requirement.equipment && (
                    <div>
                      <span className="text-sm text-gray-500">Equipment Provided: </span>
                      <span className="font-semibold text-gray-900">{requirement.equipment}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {requirement.category === "crew" && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Crew Details</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div>
                    <span className="text-sm text-gray-500">Crew Role: </span>
                    <span className="font-semibold text-gray-900">{requirement.crewRole || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Number Required: </span>
                    <span className="font-semibold text-gray-900">{requirement.numberOfCrew || "Not specified"}</span>
                  </div>
                  {requirement.shiftTiming && (
                    <div>
                      <span className="text-sm text-gray-500">Shift Timing: </span>
                      <span className="font-semibold text-gray-900">{requirement.shiftTiming}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Additional Requirements */}
            {requirement.additionalRequirements && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Additional Requirements</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 whitespace-pre-wrap">{requirement.additionalRequirements}</p>
                </div>
              </section>
            )}

            {/* Posted Info */}
            <section className="border-t pt-6">
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
