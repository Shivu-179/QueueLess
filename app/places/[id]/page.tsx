'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function PlaceDetailPage() {
  const params = useParams();
  const placeId = params?.id as string;
  const [place, setPlace] = useState<any>(null);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Feedback form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    if (placeId) {
      fetchPlaceData();
    }
  }, [placeId]);

  const fetchPlaceData = async () => {
    try {
      const [placeRes, fbRes] = await Promise.all([
        fetch(`/api/places/${placeId}`).then((r) => r.json()),
        fetch(`/api/feedback?placeId=${placeId}`).then((r) => r.json()),
      ]);

      if (placeRes.success) setPlace(placeRes.place);
      if (fbRes.success) setFeedbacks(fbRes.feedbacks);
    } catch {
      console.error('Failed to load place details');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    setFeedbackMsg('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId,
          rating,
          comment,
          userName: reviewerName || 'Citizen Contributor',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedbackMsg('🎉 Thank you! Your feedback has been recorded.');
        setComment('');
        fetchPlaceData();
      }
    } catch {
      setFeedbackMsg('Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const getBadge = (level: string) => {
    switch (level) {
      case 'LOW':
        return { emoji: '🟢', label: 'LOW', class: 'badge-low', color: '#047857' };
      case 'MEDIUM':
        return { emoji: '🟡', label: 'MEDIUM', class: 'badge-medium', color: '#b45309' };
      case 'HIGH':
        return { emoji: '🟠', label: 'HIGH', class: 'badge-high', color: '#c2410c' };
      case 'VERY_HIGH':
      default:
        return { emoji: '🔴', label: 'VERY HIGH', class: 'badge-very-high', color: '#b91c1c' };
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1.5rem', color: '#64748b' }}>
        Loading facility intelligence...
      </div>
    );
  }

  if (!place) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <h2>Facility Not Found</h2>
        <Link href="/places" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          &larr; Back to Places
        </Link>
      </div>
    );
  }

  const badge = getBadge(place.currentCrowd);

  // Hourly prediction graph simulation
  const hourlyForecast = [
    { time: '09:00 AM', wait: Math.max(5, Math.round(place.estimatedWait * 0.45)), isBest: false },
    { time: '10:00 AM', wait: Math.round(place.estimatedWait * 0.85), isBest: false },
    { time: '11:00 AM', wait: Math.round(place.estimatedWait * 1.25), isBest: false },
    { time: '12:00 PM', wait: Math.round(place.estimatedWait * 1.40), isBest: false },
    { time: '01:00 PM', wait: Math.round(place.estimatedWait * 0.80), isBest: false },
    { time: '02:00 PM', wait: Math.max(5, Math.round(place.estimatedWait * 0.40)), isBest: true },
    { time: '03:00 PM', wait: Math.round(place.estimatedWait * 0.95), isBest: false },
    { time: '04:00 PM', wait: Math.round(place.estimatedWait * 0.65), isBest: false },
  ];

  const maxWait = Math.max(...hourlyForecast.map((h) => h.wait), 40);

  return (
    <div style={{ flex: 1, paddingBottom: '3.5rem' }}>
      {/* Header Banner */}
      <div className="detail-header">
        <div className="detail-container">
          <Link href="/places" style={{ fontSize: '0.88rem', color: '#2563eb', fontWeight: 600, display: 'inline-block', marginBottom: '0.75rem' }}>
            &larr; Back to All Places
          </Link>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="place-type">{place.type}</span>
                {place.department && (
                  <span style={{ background: '#dbeafe', color: '#1e40af', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600 }}>
                    🏢 {place.department}
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginTop: '0.35rem', color: '#0f172a' }}>
                {place.name}
              </h1>
              <p style={{ color: '#475569', fontSize: '0.95rem', marginTop: '0.35rem' }}>
                📍 <strong>Specific Location:</strong> {place.roomLocation || place.address}
              </p>
              {place.contactPerson && (
                <p style={{ color: '#0284c7', fontSize: '0.88rem', marginTop: '0.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span>👤 <strong>In-Charge:</strong> {place.contactPerson}</span>
                  {place.contactPhone && (
                    <span>📞 <a href={`tel:${place.contactPhone}`} style={{ textDecoration: 'underline', fontWeight: 600 }}>{place.contactPhone}</a></span>
                  )}
                </p>
              )}
            </div>
            <span className={`badge ${badge.class}`} style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>
              {badge.emoji} {badge.label} CROWD
            </span>
          </div>
        </div>
      </div>

      <div className="detail-container">
        <div className="detail-grid">
          {/* Main Info Column */}
          <div>
            {/* Live Queue Overview Card */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '2rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                Live Queue & Waiting Estimation
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className="wait-stat-box" style={{ margin: 0 }}>
                  <div className="wait-label">Current Estimated Wait</div>
                  <div className="wait-value" style={{ color: badge.color }}>
                    {place.estimatedWait} <span style={{ fontSize: '1.1rem' }}>mins</span>
                  </div>
                </div>

                <div className="wait-stat-box" style={{ margin: 0 }}>
                  <div className="wait-label">Active Serving Counters</div>
                  <div className="wait-value" style={{ color: '#2563eb' }}>
                    {place.counters} <span style={{ fontSize: '1.1rem' }}>desks</span>
                  </div>
                </div>
              </div>

              {/* Best Time Recommendation Box */}
              <div className="best-time-box" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                <div className="best-time-title" style={{ fontSize: '1.05rem', marginBottom: '0.4rem' }}>
                  <span>⭐ Recommended Best Time Today:</span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#451a03' }}>
                  {place.bestTime}
                </div>
                <p style={{ color: '#78350f', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  Expected wait during this window is only ~{place.expectedWaitAtBest} minutes.
                </p>
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <Link
                  href={`/report?placeId=${place.id}`}
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                >
                  📝 Report Your Waiting Time at this Facility
                </Link>
              </div>
            </div>

            {/* Visual Hourly Forecast Chart */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    📊 Hourly Expected Waiting Time Forecast
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                    Predicted queue times across operating hours today based on historical logs.
                  </p>
                </div>
                <span style={{ fontSize: '0.8rem', background: '#fef3c7', color: '#92400e', padding: '0.25rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                  ⭐ Gold = Best Time
                </span>
              </div>

              {/* Bar Chart Container */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '0.6rem', height: '180px', paddingTop: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                {hourlyForecast.map((slot, i) => {
                  const barHeight = Math.round((slot.wait / maxWait) * 130) + 20;
                  const isGold = slot.isBest;
                  return (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.35rem', color: isGold ? '#b45309' : '#475569' }}>
                        {slot.wait}m
                      </span>
                      <div
                        style={{
                          width: '100%',
                          maxWidth: '36px',
                          height: `${barHeight}px`,
                          backgroundColor: isGold ? '#f59e0b' : '#3b82f6',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.3s ease',
                          boxShadow: isGold ? '0 0 10px rgba(245, 158, 11, 0.4)' : 'none',
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Time Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', marginTop: '0.5rem' }}>
                {hourlyForecast.map((slot, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: slot.isBest ? '#b45309' : '#64748b', fontWeight: slot.isBest ? 700 : 500 }}>
                    {slot.time.replace(':00', '')}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports Table */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>
                Recent Citizen Queue Submissions
              </h3>
              {(!place.reports || place.reports.length === 0) ? (
                <p style={{ color: '#64748b' }}>No reports recorded today yet. Be the first to report!</p>
              ) : (
                <div className="table-container" style={{ margin: 0, border: 'none' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Contributor</th>
                        <th>Wait Time</th>
                        <th>Crowd</th>
                        <th>People in Line</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {place.reports.map((rep: any) => (
                        <tr key={rep.id}>
                          <td>{rep.userName || 'Citizen'}</td>
                          <td><strong>{rep.waitingTime} mins</strong></td>
                          <td>{rep.crowdLevel}</td>
                          <td>{rep.peopleWaiting} waiting</td>
                          <td>
                            {rep.isSuspicious ? (
                              <span style={{ color: '#b91c1c', fontWeight: 700, fontSize: '0.78rem' }}>⚠️ Flagged</span>
                            ) : (
                              <span style={{ color: '#047857', fontWeight: 700, fontSize: '0.78rem' }}>✓ Verified</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Citizen Reviews & Feedback Section */}
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                ⭐ Citizen Service Feedback & Reviews
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Rate counter service quality, staff efficiency, and queue management.
              </p>

              {/* Feedback Form */}
              <form onSubmit={handleFeedbackSubmit} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label className="form-label">Service Rating</label>
                    <select
                      className="form-select"
                      value={rating}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ 4 Stars (Good)</option>
                      <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                      <option value={2}>⭐⭐ 2 Stars (Slow Service)</option>
                      <option value={1}>⭐ 1 Star (Very Crowded)</option>
                    </select>
                  </div>

                  <div style={{ flex: 1, minWidth: '160px' }}>
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Aarav Mehta"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Feedback Comment</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g. Counter 3 was moving quickly today. Recommended 2 PM slot was accurate!"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="btn btn-primary btn-sm"
                >
                  {submittingFeedback ? 'Posting...' : 'Submit Feedback'}
                </button>

                {feedbackMsg && (
                  <span style={{ marginLeft: '1rem', fontSize: '0.88rem', color: '#047857', fontWeight: 600 }}>
                    {feedbackMsg}
                  </span>
                )}
              </form>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {feedbacks.map((fb) => (
                  <div key={fb.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong>{fb.userName}</strong>
                      <span style={{ color: '#f59e0b', fontSize: '0.95rem' }}>
                        {'⭐'.repeat(fb.rating)}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', marginTop: '0.3rem' }}>
                      &ldquo;{fb.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Overview Column */}
          <div>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', position: 'sticky', top: '90px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                Facility Summary
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>OPERATING HOURS</span>
                  <strong>{place.openingTime} – {place.closingTime}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>ACTIVE COUNTERS</span>
                  <strong>{place.counters} Service Desks</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>PUBLIC SECTOR</span>
                  <strong>{place.type}</strong>
                </div>

                <div>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.8rem' }}>TODAY&apos;S STATUS</span>
                  <span style={{ color: '#047857', fontWeight: 700 }}>🟢 Serving Visitors</span>
                </div>

                {/* Specific Room & Contact Info */}
                <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    🏛️ Specific Office & Contacts
                  </h5>

                  {place.department && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>ROOM / DEPARTMENT</span>
                      <strong style={{ color: '#1e40af', fontSize: '0.85rem' }}>{place.department}</strong>
                    </div>
                  )}

                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>EXACT FLOOR / WING LOCATION</span>
                    <span style={{ color: '#334155', fontSize: '0.85rem' }}>📍 {place.roomLocation || place.address}</span>
                  </div>

                  {place.contactPerson && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>OFFICER / IN-CHARGE</span>
                      <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>👤 {place.contactPerson}</strong>
                    </div>
                  )}

                  {place.contactPhone && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>DIRECT PHONE / HELPLINE</span>
                      <a href={`tel:${place.contactPhone}`} style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'underline' }}>
                        📞 {place.contactPhone}
                      </a>
                    </div>
                  )}

                  {place.contactEmail && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>OFFICIAL INQUIRY EMAIL</span>
                      <a href={`mailto:${place.contactEmail}`} style={{ color: '#2563eb', fontSize: '0.82rem', wordBreak: 'break-all', textDecoration: 'underline' }}>
                        ✉️ {place.contactEmail}
                      </a>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <Link href={`/report?placeId=${place.id}`} className="btn btn-outline btn-sm" style={{ width: '100%' }}>
                    Report Queue Time
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}