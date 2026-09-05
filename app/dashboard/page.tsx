'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const [places, setPlaces] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/places').then((r) => r.json()),
      fetch('/api/reports').then((r) => r.json()),
    ])
      .then(([placesData, reportsData]) => {
        if (placesData.success) setPlaces(placesData.places);
        if (reportsData.success) setReports(reportsData.reports);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPlaces = places.length;
  const avgWait = places.length > 0
    ? Math.round(places.reduce((acc, p) => acc + p.estimatedWait, 0) / places.length)
    : 0;

  const sortedPlaces = [...places].sort((a, b) => a.estimatedWait - b.estimatedWait);
  const leastCrowded = sortedPlaces[0];
  const mostCrowded = sortedPlaces[sortedPlaces.length - 1];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h1 className="section-title">Live Crowd & Queue Dashboard</h1>
        <p className="section-desc">
          Real-time community insights, average wait durations, and public queue updates.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
          Loading live statistics...
        </div>
      ) : (
        <>
          {/* KPI Stat Cards */}
          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-title">Monitored Facilities</div>
              <div className="kpi-value">{totalPlaces}</div>
              <div className="kpi-sub">Hospitals, Banks, Offices</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">City Average Wait Time</div>
              <div className="kpi-value" style={{ color: '#2563eb' }}>{avgWait} mins</div>
              <div className="kpi-sub">Across all public counters</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Least Crowded Facility</div>
              <div className="kpi-value" style={{ color: '#047857', fontSize: '1.4rem' }}>
                {leastCrowded ? leastCrowded.name : 'N/A'}
              </div>
              <div className="kpi-sub">⏱ ~{leastCrowded?.estimatedWait} mins wait</div>
            </div>

            <div className="kpi-card">
              <div className="kpi-title">Most Crowded Facility</div>
              <div className="kpi-value" style={{ color: '#b91c1c', fontSize: '1.4rem' }}>
                {mostCrowded ? mostCrowded.name : 'N/A'}
              </div>
              <div className="kpi-sub">⏱ ~{mostCrowded?.estimatedWait} mins wait</div>
            </div>
          </div>

          {/* Places Quick Status Table */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Live Crowd Rankings</h2>
              <Link href="/places" className="btn btn-outline btn-sm">
                View All Details &rarr;
              </Link>
            </div>

            <div className="table-container" style={{ margin: 0, border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>Type</th>
                    <th>Crowd Level</th>
                    <th>Est. Waiting Time</th>
                    <th>Best Visiting Hours</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((p) => (
                    <tr key={p.id}>
                      <td><strong>{p.name}</strong></td>
                      <td><span className="place-type">{p.type}</span></td>
                      <td>
                        <span className={`badge badge-${p.currentCrowd.toLowerCase().replace('_', '-')}`}>
                          {p.currentCrowd}
                        </span>
                      </td>
                      <td><strong>{p.estimatedWait} mins</strong></td>
                      <td>⭐ {p.bestTime}</td>
                      <td>
                        <Link href={`/places/${p.id}`} className="btn btn-outline btn-sm">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Community Feed */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Recent Citizen Submissions
            </h2>
            <div className="table-container" style={{ margin: 0, border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Facility</th>
                    <th>Contributor</th>
                    <th>Reported Wait</th>
                    <th>Crowd Level</th>
                    <th>Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.placeName || 'Public Counter'}</strong></td>
                      <td>{r.userName || 'Citizen'}</td>
                      <td>{r.waitingTime} mins</td>
                      <td>{r.crowdLevel}</td>
                      <td>
                        {r.isSuspicious ? (
                          <span style={{ color: '#b91c1c', fontWeight: 700 }}>⚠️ Flagged (Fake Check)</span>
                        ) : (
                          <span style={{ color: '#047857', fontWeight: 700 }}>✓ Verified Citizen</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}