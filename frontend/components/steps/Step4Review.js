'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useWizardStore from '@/store/wizardStore';
import { createRequirement } from '@/lib/api';

export default function Step4Review({ onBack, onEditStep }) {
  const router = useRouter();
  const { data, reset } = useWizardStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build payload
      const payload = {
        ...data.step1,
        details: {
          ...data.step2,
          ...data.step3
        }
      };

      // Convert dates to ISO strings
      if (payload.eventDate) {
        payload.eventDate = new Date(payload.eventDate).toISOString();
      }
      if (payload.startDate) {
        payload.startDate = new Date(payload.startDate).toISOString();
      }
      if (payload.endDate) {
        payload.endDate = new Date(payload.endDate).toISOString();
      }

      const response = await createRequirement(payload);
      setSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to submit requirement');
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnother = () => {
    reset();
    setSuccess(null);
    setError(null);
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-starlit mb-3">
            Success!
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            Your requirement has been posted successfully.
          </p>
          <div className="bg-gradient-to-br from-starlit/20 to-moonstone/20 p-6 rounded-2xl inline-block border-2 border-starlit/50 backdrop-blur-sm">
            <p className="text-base text-gray-200 mb-2">
              <span className="font-semibold text-starlit">ID:</span>{' '}
              <span className="text-moonstone font-mono">{success._id}</span>
            </p>
            <p className="text-base text-gray-200">
              <span className="font-semibold text-starlit">Category:</span>{' '}
              <span className="capitalize text-moonstone font-semibold">{success.category}</span>
            </p>
          </div>
        </div>
        <button
          onClick={handlePostAnother}
          className="btn-primary"
        >
          Post Another Requirement
        </button>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border-2 border-red-500/50 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Event Basics */}
      <div className="bg-gradient-to-br from-starlit/10 to-moonstone/10 p-6 rounded-2xl border-2 border-starlit/30 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-starlit">Event Basics</h3>
          <button
            onClick={() => onEditStep(1)}
            className="text-moonstone hover:text-starlit text-sm font-semibold transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-semibold text-gray-300">Event Name:</span> <span className="text-gray-400">{data.step1.eventName}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Event Type:</span> <span className="text-gray-400">{data.step1.eventType}
            {data.step1.eventTypeOther && ` (${data.step1.eventTypeOther})`}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Date:</span>{' '}
            <span className="text-gray-400">{data.step1.dateMode === 'single'
              ? formatDate(data.step1.eventDate)
              : `${formatDate(data.step1.startDate)} - ${formatDate(data.step1.endDate)}`}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-300">Location:</span> <span className="text-gray-400">{data.step1.location}</span>
          </div>
          {data.step1.venue && (
            <div>
              <span className="font-semibold text-gray-300">Venue:</span> <span className="text-gray-400">{data.step1.venue}</span>
            </div>
          )}
          <div>
            <span className="font-semibold text-gray-300">Category:</span>{' '}
            <span className="capitalize text-starlit font-semibold">{data.step1.category}</span>
          </div>
        </div>
      </div>

      {/* Details Part 1 */}
      <div className="bg-gradient-to-br from-moonstone/10 to-nebula/10 p-6 rounded-2xl border-2 border-moonstone/30 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-moonstone">Details (Part 1)</h3>
          <button
            onClick={() => onEditStep(2)}
            className="text-starlit hover:text-moonstone text-sm font-semibold transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {data.step1.category === 'planner' && (
            <>
              <div>
                <span className="font-semibold text-gray-300">Services:</span>{' '}
                <span className="text-gray-400">{data.step2.servicesNeeded?.join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Guest Count:</span> <span className="text-gray-400">{data.step2.guestCount}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Budget:</span> <span className="text-gray-400">{data.step2.currency}{' '}
                {data.step2.budgetMin} - {data.step2.budgetMax}</span>
              </div>
            </>
          )}
          {data.step1.category === 'performer' && (
            <>
              <div>
                <span className="font-semibold text-gray-300">Type:</span> <span className="text-gray-400">{data.step2.performerType}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Genres:</span> <span className="text-gray-400">{data.step2.genres?.join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Duration:</span> <span className="text-gray-400">{data.step2.durationMinutes} min</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Performers:</span> <span className="text-gray-400">{data.step2.numberOfPerformers}</span>
              </div>
            </>
          )}
          {data.step1.category === 'crew' && (
            <>
              <div>
                <span className="font-semibold text-gray-300">Roles:</span> <span className="text-gray-400">{data.step2.crewRoles?.join(', ')}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Crew Count:</span> <span className="text-gray-400">{data.step2.crewCount}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Shift:</span> <span className="text-gray-400">{data.step2.shiftStart} -{' '}
                {data.step2.shiftEnd}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Part 2 */}
      <div className="bg-gradient-to-br from-nebula/10 to-midnight/10 p-6 rounded-2xl border-2 border-nebula/30 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-nebula">Details (Part 2)</h3>
          <button
            onClick={() => onEditStep(3)}
            className="text-starlit hover:text-moonstone text-sm font-semibold transition-colors"
          >
            Edit
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {data.step1.category === 'planner' && (
            <>
              {data.step3.theme && (
                <div>
                  <span className="font-semibold text-gray-300">Theme:</span> <span className="text-gray-400">{data.step3.theme}</span>
                </div>
              )}
              {data.step3.needsVendorCoordination !== undefined && (
                <div>
                  <span className="font-semibold text-gray-300">Vendor Coordination:</span>{' '}
                  <span className="text-gray-400">{data.step3.needsVendorCoordination ? 'Yes' : 'No'}</span>
                </div>
              )}
              {data.step3.preferredContactTime && (
                <div>
                  <span className="font-semibold text-gray-300">Contact Time:</span>{' '}
                  <span className="text-gray-400">{data.step3.preferredContactTime}</span>
                </div>
              )}
            </>
          )}
          {data.step1.category === 'performer' && (
            <>
              <div>
                <span className="font-semibold text-gray-300">Fee/Performer:</span> <span className="text-gray-400">${data.step3.feePerPerformer}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Equipment by Host:</span>{' '}
                <span className="text-gray-400">{data.step3.equipmentProvidedByHost ? 'Yes' : 'No'}</span>
              </div>
              {data.step3.stageSize && (
                <div>
                  <span className="font-semibold text-gray-300">Stage Size:</span> <span className="text-gray-400">{data.step3.stageSize}</span>
                </div>
              )}
            </>
          )}
          {data.step1.category === 'crew' && (
            <>
              <div>
                <span className="font-semibold text-gray-300">Experience:</span> <span className="text-gray-400">{data.step3.experienceLevel}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Pay:</span> <span className="text-gray-400">${data.step3.payRate}{' '}
                {data.step3.payType}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Accommodation:</span>{' '}
                <span className="text-gray-400">{data.step3.accommodationProvided ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-300">Transport:</span>{' '}
                <span className="text-gray-400">{data.step3.transportProvided ? 'Yes' : 'No'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="btn-neutral"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Submitting...' : 'Submit Requirement'}
        </button>
      </div>
    </div>
  );
}
