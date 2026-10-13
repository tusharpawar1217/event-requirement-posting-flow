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
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState("");
  const [interestContact, setInterestContact] = useState("");
  const [submittingInterest, setSubmittingInterest] = useState(false);
  const [similarEvents, setSimilarEvents] = useState([]);

  useEffect(() => {
    fetchRequirement();
    fetchSimilarEvents();
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

  const fetchSimilarEvents = async () => {
    try {
      const response = await api.get(`/requirements/${id}/similar`);
      setSimilarEvents(response.data.data || []);
    } catch (err) {
      console.error("Failed to load similar events:", err);
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

  const handleSave = async () => {
    const newSavedState = !saved;
    setSaved(newSavedState);
    toast.success(newSavedState ? "SAVED" : "UNSAVED");
    
    try {
      await api.post(`/requirements/${id}/save`, { saved: newSavedState });
      // Update local count
      setRequirement(prev => ({
        ...prev,
        saveCount: (prev.saveCount || 0) + (newSavedState ? 1 : -1)
      }));
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleExpressInterest = async () => {
    if (!user) {
      toast.error("LOGIN REQUIRED");
      router.push("/login");
      return;
    }

    setSubmittingInterest(true);
    try {
      await api.post(`/requirements/${id}/interest`, {
        message: interestMessage,
        contact: interestContact || user.email
      });
      toast.success("INTEREST SUBMITTED!");
      setShowInterestModal(false);
      setInterestMessage("");
      setInterestContact("");
      fetchRequirement(); // Refresh to show updated count
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || "SUBMISSION FAILED";
      toast.error(errorMsg);
    } finally {
      setSubmittingInterest(false);
    }
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

  const isExpired = () => {
    const eventDate = new Date(requirement.eventDate);
    // If invalid date, consider it expired
    if (isNaN(eventDate.getTime())) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
  };

  const getDaysUntil = () => {
    const eventDate = new Date(requirement.eventDate);
    // If invalid date, return negative to show expired
    if (isNaN(eventDate.getTime())) return -999;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = () => {
    const daysUntil = getDaysUntil();
    
    // Invalid or expired dates
    if (daysUntil < 0 || isNaN(daysUntil)) {
      return <span className="px-2 py-1 bg-red-900 text-red-300 border border-red-700 text-xs font-semibold uppercase">Expired</span>;
    } else if (daysUntil === 0) {
      return <span className="px-2 py-1 bg-yellow-900 text-yellow-300 border border-yellow-700 text-xs font-semibold uppercase">Today</span>;
    } else if (daysUntil <= 7) {
      return <span className="px-2 py-1 bg-orange-900 text-orange-300 border border-orange-700 text-xs font-semibold uppercase">Urgent</span>;
    } else {
      return <span className="badge-primary text-xs">Active</span>;
    }
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge">{categoryIcons[requirement.category]} {requirement.category.toUpperCase()}</div>
                    {getStatusBadge()}
                  </div>
                  <h1 className="text-3xl font-black text-gray-100 uppercase mb-2">{requirement.eventName}</h1>
                  {requirement.description && (
                    <p className="text-gray-400">{requirement.description}</p>
                  )}
                  {isExpired() && (
                    <div className="mt-4 px-4 py-3 bg-red-900/20 border border-red-800 text-red-300 text-sm">
                      ⚠️ <strong>EXPIRED:</strong> Event date has passed. Contact poster for updates.
                    </div>
                  )}
                  {!isExpired() && getDaysUntil() <= 3 && (
                    <div className="mt-4 px-4 py-3 bg-orange-900/20 border border-orange-800 text-orange-300 text-sm">
                      ⏰ <strong>URGENT:</strong> Event is {getDaysUntil()} day{getDaysUntil() !== 1 ? 's' : ''} away!
                    </div>
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
                  <span className="text-starlit font-bold">{requirement.viewCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">SAVED</span>
                  <span className="text-moonstone font-bold">{requirement.saveCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">INTEREST</span>
                  <span className="text-starlit font-bold">{requirement.interestCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">STATUS</span>
                  {getStatusBadge()}
                </div>
                {!isExpired() && getDaysUntil() <= 30 && (
                  <div className="flex justify-between pt-2 border-t-2 border-dark-700">
                    <span className="text-gray-500 text-sm">DAYS LEFT</span>
                    <span className="text-starlit font-black text-lg">{getDaysUntil()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Express Interest Button */}
            {!canEdit && (
              <div className="card p-6 bg-starlit/5 border-starlit">
                <h3 className="text-sm font-black text-starlit uppercase mb-3">INTERESTED?</h3>
                <button
                  onClick={() => setShowInterestModal(true)}
                  className="w-full btn-primary py-3"
                >
                  EXPRESS INTEREST
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Get notified about this event
                </p>
              </div>
            )}

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

        {/* Similar Events Section */}
        {similarEvents.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-black text-gray-200 uppercase mb-4 border-b-2 border-dark-600 pb-2">
              SIMILAR EVENTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarEvents.map((event) => (
                <Link
                  key={event._id}
                  href={`/requirements/${event._id}`}
                  className="card p-4 hover:border-starlit transition"
                >
                  <h3 className="font-bold text-gray-200 mb-2 text-sm line-clamp-2">
                    {event.eventName}
                  </h3>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>📍 {event.location}</div>
                    <div>📅 {formatDate(event.eventDate)}</div>
                  </div>
                  <div className="mt-2 text-xs text-starlit font-bold">
                    VIEW →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Interest Modal */}
        {showInterestModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="card max-w-md w-full p-6">
              <h2 className="text-xl font-black text-starlit uppercase mb-4">EXPRESS INTEREST</h2>
              <p className="text-gray-400 text-sm mb-4">
                Send your interest to the event organizer. They'll be notified with your contact details.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
                    Message (Optional)
                  </label>
                  <textarea
                    value={interestMessage}
                    onChange={(e) => setInterestMessage(e.target.value)}
                    placeholder="Tell them why you're interested..."
                    className="w-full bg-dark-800 border-2 border-dark-600 text-gray-200 px-3 py-2 text-sm focus:border-starlit outline-none resize-none"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">
                    Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={interestContact}
                    onChange={(e) => setInterestContact(e.target.value)}
                    placeholder={user?.email || "Your email or phone"}
                    className="w-full bg-dark-800 border-2 border-dark-600 text-gray-200 px-3 py-2 text-sm focus:border-starlit outline-none"
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Defaults to your account email
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleExpressInterest}
                    disabled={submittingInterest}
                    className="flex-1 btn-primary py-2"
                  >
                    {submittingInterest ? "SUBMITTING..." : "SUBMIT INTEREST"}
                  </button>
                  <button
                    onClick={() => setShowInterestModal(false)}
                    disabled={submittingInterest}
                    className="px-4 py-2 bg-dark-800 border-2 border-dark-600 text-gray-300 hover:border-gray-500 transition"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
