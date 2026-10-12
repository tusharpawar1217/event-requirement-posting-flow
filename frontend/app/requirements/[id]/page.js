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
  const [saved, setSaved] = useState(false);

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
      setError(err.response?.data?.error?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("DELETE THIS REQUIREMENT? This cannot be undone.")) return;
    
    setDeleting(true);
    try {
      await api.delete(`/requirements/${id}`);
      toast.success("DELETED");
      router.push("/browse");
    } catch (err) {
      toast.error("DELETE FAILED");
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    toast.success(saved ? "UNSAVED" : "SAVED");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("LINK COPIED");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cosmic">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-starlit border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold uppercase">LOADING...</p>
        </div>
      </div>
    );
  }

  if (error || !requirement) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cosmic">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-starlit mb-4 uppercase">{error || "NOT FOUND"}</h2>
          <Link href="/browse" className="btn-primary inline-block">
            BACK TO BROWSE
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
    <main className="min-h-screen py-6 px-4 bg-cosmic">
      <div className="max-w-6xl mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-dark-600">
          <Link
            href="/browse"
            className="flex items-center gap-2 text-gray-400 hover:text-starlit transition font-bold uppercase text-sm"
          >
            ← BACK
          </Link>

          <div className="flex gap-2">
            <button onClick={handleShare} className="px-3 py-2 bg-dark-800 border-2 border-dark-600 text-gray-300 hover:border-starlit transition" title="Share">
              SHARE
            </button>
            <button onClick={handleSave} className={`px-3 py-2 border-2 transition ${saved ? 'bg-starlit text-cosmic border-starlit' : 'bg-dark-800 border-dark-600 text-gray-300 hover:border-starlit'}`}>
              {saved ? '★ SAVED' : '☆ SAVE'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card p-6 border-l-4 border-starlit">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="badge mb-2">{categoryIcons[requirement.category]} {requirement.category.toUpperCase()}</div>
                  <h1 className="text-3xl font-black text-gray-100 uppercase mb-2">{requirement.eventName}</h1>
                  {requirement.description && (
                    <p className="text-gray-400">{requirement.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="card p-6">
              <h2 className="section-title">EVENT DETAILS</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dark-600 p-4">
                  <div className="text-xs text-gray-500 font-bold mb-1">DATE</div>
                  <div className="text-lg font-bold text-gray-200">{formatDate(requirement.eventDate)}</div>
                </div>
                <div className="border-2 border-dark-600 p-4">
                  <div className="text-xs text-gray-500 font-bold mb-1">TIME</div>
                  <div className="text-lg font-bold text-gray-200">{requirement.eventTime || 'TBD'}</div>
                </div>
                <div className="border-2 border-dark-600 p-4">
                  <div className="text-xs text-gray-500 font-bold mb-1">LOCATION</div>
                  <div className="text-lg font-bold text-gray-200">{requirement.location}</div>
                </div>
                <div className="border-2 border-dark-600 p-4">
                  <div className="text-xs text-gray-500 font-bold mb-1">BUDGET</div>
                  <div className="text-lg font-bold text-starlit">${requirement.budget?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Category Specific */}
            {requirement.category === "planner" && (
              <div className="card p-6">
                <h2 className="section-title">PLANNING INFO</h2>
                <div className="space-y-3">
                  <div className="flex justify-between border-b-2 border-dark-700 pb-2">
                    <span className="text-gray-500 font-bold text-sm">EVENT TYPE</span>
                    <span className="text-gray-200 font-bold">{requirement.eventType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-dark-700 pb-2">
                    <span className="text-gray-500 font-bold text-sm">GUESTS</span>
                    <span className="text-gray-200 font-bold">{requirement.guestCount || 'N/A'}</span>
                  </div>
                  {requirement.venuePreference && (
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500 font-bold text-sm">VENUE</span>
                      <span className="text-gray-200 font-bold">{requirement.venuePreference}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {requirement.category === "performer" && (
              <div className="card p-6">
                <h2 className="section-title">PERFORMANCE INFO</h2>
                <div className="space-y-3">
                  <div className="flex justify-between border-b-2 border-dark-700 pb-2">
                    <span className="text-gray-500 font-bold text-sm">TYPE</span>
                    <span className="text-gray-200 font-bold">{requirement.performanceType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-dark-700 pb-2">
                    <span className="text-gray-500 font-bold text-sm">DURATION</span>
                    <span className="text-gray-200 font-bold">{requirement.duration || 'N/A'}</span>
                  </div>
                  {requirement.equipment && (
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500 font-bold text-sm">EQUIPMENT</span>
                      <span className="text-gray-200 font-bold">{requirement.equipment}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {requirement.category === "crew" && (
              <div className="card p-6">
                <h2 className="section-title">CREW INFO</h2>
                <div className="space-y-3">
                  <div className="flex justify-between border-b-2 border-dark-700 pb-2">
                    <span className="text-gray-500 font-bold text-sm">ROLE</span>
                    <span className="text-gray-200 font-bold">{requirement.crewRole || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b-2 border-dark-700 pb-2">
                    <span className="text-gray-500 font-bold text-sm">REQUIRED</span>
                    <span className="text-gray-200 font-bold">{requirement.numberOfCrew || 'N/A'}</span>
                  </div>
                  {requirement.shiftTiming && (
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-500 font-bold text-sm">SHIFT</span>
                      <span className="text-gray-200 font-bold">{requirement.shiftTiming}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {requirement.additionalRequirements && (
              <div className="card p-6">
                <h2 className="section-title">ADDITIONAL</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{requirement.additionalRequirements}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {canEdit && (
              <div className="card p-6">
                <h3 className="text-sm font-black text-gray-400 uppercase mb-4">YOUR LISTING</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push(`/requirements/${id}/edit`)}
                    className="w-full btn-secondary py-2"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full btn-danger py-2"
                  >
                    {deleting ? 'DELETING...' : 'DELETE'}
                  </button>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="card p-6">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-4">STATISTICS</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">POSTED</span>
                  <span className="text-gray-300 font-bold text-sm">{formatDate(requirement.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">VIEWS</span>
                  <span className="text-starlit font-bold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">STATUS</span>
                  <span className="badge-primary">ACTIVE</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="card p-6 bg-dark-900">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-4">QUICK INFO</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📍</span>
                  <span>{requirement.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>💰</span>
                  <span>${requirement.budget?.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📅</span>
                  <span>{formatDate(requirement.eventDate)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
