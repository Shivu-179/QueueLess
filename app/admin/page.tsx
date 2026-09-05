'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlace, setNewPlace] = useState({
    name: '',
    type: 'Hospital',
    address: '',
    department: '',
    roomLocation: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    openingTime: '09:00 AM',
    closingTime: '05:00 PM',
    counters: 4,
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('queueless_user');
      if (!stored) {
        router.push('/admin/login');
        return;
      }
      try {
        const u = JSON.parse(stored);
        if (u.role !== 'ADMIN') {
          router.push('/admin/login');
          return;
        }
      } catch {
        router.push('/admin/login');
        return;
      }
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch {
      console.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePlace = async (placeId: string) => {
    try {
      const res = await fetch(`/api/places/${placeId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setMessage('Facility status updated successfully.');
        fetchStats();
      }
    } catch {
      setMessage('Error updating facility status.');
    }
  };

  const handleModerate = async (reportId: string, action: 'APPROVE' | 'DELETE') => {
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
        fetchStats();
      }
    } catch {
      setMessage('Error performing moderation.');
    }
  };

  const handleAddPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPlace),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('New facility with office, room and contact directory added successfully!');
        setShowAddModal(false);
        setNewPlace({
          name: '',
          type: 'Hospital',
          address: '',
          department: '',
          roomLocation: '',
          contactPerson: '',
          contactPhone: '',
          contactEmail: '',
          openingTime: '09:00 AM',
          closingTime: '05:00 PM',
          counters: 4,
        });
        fetchStats();
      }
    } catch {
      setMessage('Failed to add facility.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
        Loading Admin Command Portal...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="section-title" style={{ margin: 0 }}>Administrator Dashboard</h1>
            <span className="badge badge-high" style={{ fontSize: '0.75rem' }}>ADMIN ACCESS</span>
          </div>
          <p className="section-desc" style={{ marginTop: '0.25rem' }}>
            Monitor crowd statistics, add public places with room & contacts, and moderate suspicious reports.
          </p>
        </div>

        <button onClick={() => setShowAddModal(!showAddModal)} className="btn btn-primary">
          {showAddModal ? 'Close Form' : '＋ Add New Facility'}
        </button>
      </div>

      {message && (
        <div className="alert-box alert-success" style={{ marginBottom: '1.5rem' }}>
          {message}
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-title">Total Registered Users</div>
          <div className="kpi-value">{stats?.totalUsers || 2}</div>
          <div className="kpi-sub">Citizen accounts & staff</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Monitored Facilities</div>
          <div className="kpi-value" style={{ color: '#2563eb' }}>{stats?.totalPlaces || 0}</div>
          <div className="kpi-sub">Hospitals, Banks, Offices, Shops</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Reports Logged Today</div>
          <div className="kpi-value">{stats?.reportsToday || 0}</div>
          <div className="kpi-sub">Real-time submissions</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Average Wait Time</div>
          <div className="kpi-value" style={{ color: '#047857' }}>{stats?.avgWait || 22} mins</div>
          <div className="kpi-sub">Across active facilities</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-title">Most Crowded Facility</div>
          <div className="kpi-value" style={{ fontSize: '1.1rem', color: '#b91c1c' }}>
            {stats?.mostCrowdedPlace || 'N/A'}
          </div>
          <div className="kpi-sub">Requires crowd intervention</div>
        </div>
      </div>

      {/* Add New Facility Form Modal/Card */}
      {showAddModal && (
        <div style={{ background: '#ffffff', border: '1px solid #2563eb', borderRadius: '16px', padding: '2rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Register New Public Facility / Office / Shop
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
            Fill in facility details including specific room/department and in-charge contact numbers.
          </p>

          <form onSubmit={handleAddPlace} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Facility Name *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Metro Civil Hospital"
                value={newPlace.name}
                onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sector Type *</label>
              <select
                className="form-select"
                value={newPlace.type}
                onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value })}
              >
                <option value="Hospital">Hospital / Healthcare</option>
                <option value="Bank">Bank / Financial</option>
                <option value="Government Office">Government / Citizen Office</option>
                <option value="College Office">College / University</option>
                <option value="Railway Station">Railway / Transit Counter</option>
                <option value="Shop / Store">Shop / Pharmacy / Store</option>
                <option value="Other">Other Public Service</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Admin Office / Room / Department *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. OPD Registration & Sample Lab (Room 102)"
                value={newPlace.department}
                onChange={(e) => setNewPlace({ ...newPlace, department: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Exact Room & Floor Location *</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Ground Floor, Wing A, Beside Trauma Ward"
                value={newPlace.roomLocation}
                onChange={(e) => setNewPlace({ ...newPlace, roomLocation: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Officer / In-Charge Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Ramesh Verma (Chief Admin)"
                value={newPlace.contactPerson}
                onChange={(e) => setNewPlace({ ...newPlace, contactPerson: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Phone / Helpline</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +91 98765 43210 / 1800-11-2233"
                value={newPlace.contactPhone}
                onChange={(e) => setNewPlace({ ...newPlace, contactPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Inquiry Email</label>
              <input
                type="email"
                className="form-input"
                placeholder="e.g. admin@cityhospital.gov.in"
                value={newPlace.contactEmail}
                onChange={(e) => setNewPlace({ ...newPlace, contactEmail: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full City Address / Landmark</label>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Sector 4 Civic Center"
                value={newPlace.address}
                onChange={(e) => setNewPlace({ ...newPlace, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Serving Counters</label>
              <input
                type="number"
                min={1}
                max={50}
                required
                className="form-input"
                value={newPlace.counters}
                onChange={(e) => setNewPlace({ ...newPlace, counters: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Opening Hours</label>
              <input
                type="text"
                className="form-input"
                placeholder="09:00 AM"
                value={newPlace.openingTime}
                onChange={(e) => setNewPlace({ ...newPlace, openingTime: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Closing Hours</label>
              <input
                type="text"
                className="form-input"
                placeholder="05:00 PM"
                value={newPlace.closingTime}
                onChange={(e) => setNewPlace({ ...newPlace, closingTime: e.target.value })}
              />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Save Facility & Enable Live Tracking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Moderation Table: Anti-Fake System */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
              🛡️ Anti-Fake Report Moderation
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Outlier values (e.g. 500 mins) are flagged automatically by algorithm to prevent spoofing.
            </p>
          </div>
          <span className="badge badge-very-high">
            {stats?.recentReports?.filter((r: any) => r.isSuspicious).length || 0} Flagged Reports
          </span>
        </div>

        <div className="table-container" style={{ margin: 0, border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Facility</th>
                <th>Contributor</th>
                <th>Reported Time</th>
                <th>Crowd Level</th>
                <th>Flag Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentReports?.map((r: any) => (
                <tr key={r.id}>
                  <td><strong>{r.placeName || 'Facility'}</strong></td>
                  <td>{r.userName || 'Citizen'}</td>
                  <td>
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, color: r.isSuspicious ? '#b91c1c' : '#0f172a' }}>
                      {r.waitingTime} mins
                    </span>
                  </td>
                  <td>{r.crowdLevel}</td>
                  <td>
                    {r.isSuspicious ? (
                      <span style={{ color: '#b91c1c', fontSize: '0.82rem', fontWeight: 600 }}>
                        ⚠️ {r.flagReason || 'Suspicious Outlier'}
                      </span>
                    ) : (
                      <span style={{ color: '#047857', fontSize: '0.82rem', fontWeight: 600 }}>
                        ✓ Within Normal Trends
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {r.isSuspicious && (
                        <button
                          onClick={() => handleModerate(r.id, 'APPROVE')}
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleModerate(r.id, 'DELETE')}
                        className="btn btn-outline btn-sm"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', color: '#b91c1c', borderColor: '#fca5a5' }}
                      >
                        Remove Fake
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Places Management Table */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>
          Monitored Places Directory
        </h2>
        <div className="table-container" style={{ margin: 0, border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Facility Name</th>
                <th>Admin Office / Room</th>
                <th>Location & In-Charge Contact</th>
                <th>Serving Desks</th>
                <th>Current Crowd</th>
                <th>Est. Wait Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.places?.map((p: any) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <div style={{ marginTop: '0.2rem' }}>
                      <span className="place-type">{p.type}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#1e40af', fontWeight: 600, fontSize: '0.85rem' }}>
                      {p.department || 'General Administration'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                      📍 {p.roomLocation || p.address}
                    </div>
                    {p.contactPerson && (
                      <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '0.15rem' }}>
                        👤 {p.contactPerson} {p.contactPhone ? `(${p.contactPhone})` : ''}
                      </div>
                    )}
                  </td>
                  <td>{p.counters} Counters</td>
                  <td>
                    <span className={`badge badge-${p.currentCrowd?.toLowerCase().replace('_', '-')}`}>
                      {p.currentCrowd}
                    </span>
                  </td>
                  <td><strong>{p.estimatedWait} mins</strong></td>
                  <td>
                    {p.isActive !== false ? (
                      <span style={{ color: '#047857', fontWeight: 700 }}>Active</span>
                    ) : (
                      <span style={{ color: '#64748b', fontWeight: 700 }}>Deactivated</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link href={`/places/${p.id}`} className="btn btn-outline btn-sm">
                        View
                      </Link>
                      <button
                        onClick={() => handleTogglePlace(p.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: p.isActive !== false ? '#b91c1c' : '#047857' }}
                      >
                        {p.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}