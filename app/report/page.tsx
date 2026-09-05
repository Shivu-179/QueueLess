'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ReportForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPlaceId = searchParams.get('placeId') || '';

  const [places, setPlaces] = useState<any[]>([]);
  const [placeId, setPlaceId] = useState(preselectedPlaceId);
  const [waitingTime, setWaitingTime] = useState('');
  const [crowdLevel, setCrowdLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH'>('MEDIUM');
  const [peopleWaiting, setPeopleWaiting] = useState('');
  const [userName, setUserName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'warning'; message: string } | null>(null);

  useEffect(() => {
    // 1. Fetch places for dropdown
    fetch('/api/places')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPlaces(data.places);
          if (!placeId && data.places.length > 0) {
            setPlaceId(preselectedPlaceId || data.places[0].id);
          }
        }
      })
      .catch(() => setError('Could not load places.'));

    // 2. Load stored user name if logged in
    const storedUser = localStorage.getItem('queueless_user');
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        setUserName(u.name || '');
      } catch {}
    }
  }, [preselectedPlaceId]);

  // Dynamic automatic crowd level suggestion based on typed minutes
  const handleTimeChange = (val: string) => {
    setWaitingTime(val);
    const mins = parseInt(val);
    if (!isNaN(mins)) {
      if (mins <= 15) setCrowdLevel('LOW');
      else if (mins <= 30) setCrowdLevel('MEDIUM');
      else if (mins <= 50) setCrowdLevel('HIGH');
      else setCrowdLevel('VERY_HIGH');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFeedback(null);

    const mins = parseInt(waitingTime);
    if (isNaN(mins) || mins <= 0) {
      setError('Please enter a valid waiting time in minutes.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId,
          waitingTime: mins,
          crowdLevel,
          peopleWaiting: parseInt(peopleWaiting) || 0,
          userName: userName.trim() || 'Anonymous Citizen',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to submit report.');
        setIsSubmitting(false);
        return;
      }

      if (data.report.isSuspicious) {
        setFeedback({
          type: 'warning',
          message: '⚠️ Notice: Your report was flagged for moderation due to high outlier values (' + mins + ' mins). An administrator will review it.',
        });
      } else {
        setFeedback({
          type: 'success',
          message: '🎉 Thank you! Your report has updated the live waiting prediction for this facility.',
        });
      }

      setTimeout(() => {
        router.push(`/places/${placeId}`);
        router.refresh();
      }, 1800);
    } catch {
      setError('Network error. Could not reach the server.');
      setIsSubmitting(false);
    }
  };

  const isExtremeTime = parseInt(waitingTime) > 240;

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem', flex: 1 }}>
      <div className="auth-card" style={{ maxWidth: '100%' }}>
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <h1 className="auth-title" style={{ fontSize: '1.75rem' }}>Report Waiting Time</h1>
          <p className="auth-desc">
            Help your community by sharing current queue conditions at public facilities.
          </p>
        </div>

        {error && <div className="alert-box alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
        {feedback && (
          <div
            className={`alert-box ${feedback.type === 'warning' ? 'alert-error' : 'alert-success'}`}
            style={{ marginBottom: '1rem' }}
          >
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Place Selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="placeSelect">Select Facility / Place</label>
            <select
              id="placeSelect"
              className="form-select"
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              required
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.type})
                </option>
              ))}
            </select>
          </div>

          {/* Waiting Time (mins) */}
          <div className="form-group">
            <label className="form-label" htmlFor="waitingTimeInput">
              Your Actual Waiting Time (Minutes)
            </label>
            <input
              id="waitingTimeInput"
              type="number"
              min={1}
              max={1440}
              required
              className="form-input"
              placeholder="e.g. 25"
              value={waitingTime}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
            {isExtremeTime && (
              <p style={{ color: '#b91c1c', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                ⚠️ Anti-Fake Guard: Times over 240 mins will be flagged as suspicious for admin verification.
              </p>
            )}
          </div>

          {/* Crowd Level Selector */}
          <div className="form-group">
            <label className="form-label">Observed Crowd Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setCrowdLevel('LOW')}
                className={`btn btn-sm ${crowdLevel === 'LOW' ? 'btn-primary' : 'btn-outline'}`}
              >
                🟢 LOW (0 - 15m)
              </button>
              <button
                type="button"
                onClick={() => setCrowdLevel('MEDIUM')}
                className={`btn btn-sm ${crowdLevel === 'MEDIUM' ? 'btn-primary' : 'btn-outline'}`}
              >
                🟡 MEDIUM (16 - 30m)
              </button>
              <button
                type="button"
                onClick={() => setCrowdLevel('HIGH')}
                className={`btn btn-sm ${crowdLevel === 'HIGH' ? 'btn-primary' : 'btn-outline'}`}
              >
                🟠 HIGH (31 - 50m)
              </button>
              <button
                type="button"
                onClick={() => setCrowdLevel('VERY_HIGH')}
                className={`btn btn-sm ${crowdLevel === 'VERY_HIGH' ? 'btn-primary' : 'btn-outline'}`}
              >
                🔴 VERY HIGH (51m+)
              </button>
            </div>
          </div>

          {/* People Waiting */}
          <div className="form-group">
            <label className="form-label" htmlFor="peopleWaitingInput">
              Approximate People Waiting in Queue
            </label>
            <input
              id="peopleWaitingInput"
              type="number"
              min={0}
              max={2000}
              className="form-input"
              placeholder="e.g. 30"
              value={peopleWaiting}
              onChange={(e) => setPeopleWaiting(e.target.value)}
            />
          </div>

          {/* Submitter Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="contributorInput">
              Your Name / Alias (Optional)
            </label>
            <input
              id="contributorInput"
              type="text"
              className="form-input"
              placeholder="Anonymous Citizen"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '0.75rem' }}
          >
            {isSubmitting ? 'Submitting & Recalculating...' : 'Submit Report'}
          </button>
        </form>

        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          QueueLess uses previous community reports to calculate rolling average wait times.
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '3rem' }}>Loading form...</div>}>
      <ReportForm />
    </Suspense>
  );
}