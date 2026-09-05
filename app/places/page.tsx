'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Place {
  id: string;
  name: string;
  type: string;
  address: string;
  department?: string;
  roomLocation?: string;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  openingTime: string;
  closingTime: string;
  counters: number;
  currentCrowd: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';
  estimatedWait: number;
  bestTime: string;
  expectedWaitAtBest: number;
  reportCount?: number;
}

export default function PlacesPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      const url = category === 'all'
        ? `/api/places`
        : `/api/places?category=${encodeURIComponent(category)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPlaces(data.places);
      }
    } catch {
      console.error('Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = places.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.contactPerson && p.contactPerson.toLowerCase().includes(q)) ||
      (p.roomLocation && p.roomLocation.toLowerCase().includes(q))
    );
  });

  const getBadgeInfo = (level: string) => {
    switch (level) {
      case 'LOW':
        return { emoji: '🟢', label: 'LOW', class: 'badge-low' };
      case 'MEDIUM':
        return { emoji: '🟡', label: 'MEDIUM', class: 'badge-medium' };
      case 'HIGH':
        return { emoji: '🟠', label: 'HIGH', class: 'badge-high' };
      case 'VERY_HIGH':
      default:
        return { emoji: '🔴', label: 'VERY HIGH', class: 'badge-very-high' };
    }
  };

  const categories = [
    { id: 'all', label: 'All Facilities' },
    { id: 'hospital', label: '🏥 Hospitals' },
    { id: 'bank', label: '🏦 Banks' },
    { id: 'government', label: '🏛️ Govt Offices' },
    { id: 'college', label: '🎓 College Offices' },
    { id: 'railway', label: '🚆 Railway Stations' },
    { id: 'shop', label: '💊 Shops / Pharmacies' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', flex: 1 }}>
      <div className="section-header" style={{ textAlign: 'left', marginBottom: '1.75rem' }}>
        <h1 className="section-title">Explore Public Facilities</h1>
        <p className="section-desc">
          Check live waiting times, crowd levels, and recommended visiting hours before stepping out.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search facility by name, branch, or sector address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-filter-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`filter-pill ${category === cat.id ? 'active' : ''}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Places Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading facilities and crowd estimations...
        </div>
      ) : filteredPlaces.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          <h3>No facilities found</h3>
          <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Try clearing your search or selecting another category.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredPlaces.map((place) => {
            const badge = getBadgeInfo(place.currentCrowd);
            return (
              <div key={place.id} className="place-card">
                <div>
                  <div className="card-top">
                    <span className="place-type">{place.type}</span>
                    <span className={`badge ${badge.class}`}>
                      {badge.emoji} {badge.label}
                    </span>
                  </div>

                  <h3 className="place-name">{place.name}</h3>

                  {/* Particular Admin Office / Department / Room */}
                  {place.department && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '0.4rem 0.65rem', marginTop: '0.4rem', marginBottom: '0.5rem', fontSize: '0.82rem', color: '#1e40af', fontWeight: 600 }}>
                      🏢 {place.department}
                    </div>
                  )}

                  {/* Room & Floor Location */}
                  <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.35rem', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                    <span>📍</span>
                    <span><strong>Location:</strong> {place.roomLocation || place.address}</span>
                  </p>

                  {/* Contact Person & Phone */}
                  {place.contactPerson && (
                    <p style={{ fontSize: '0.8rem', color: '#0369a1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                      <span>👤 {place.contactPerson}</span>
                      {place.contactPhone && (
                        <a href={`tel:${place.contactPhone}`} style={{ color: '#0284c7', fontWeight: 600, textDecoration: 'underline' }}>
                          📞 {place.contactPhone}
                        </a>
                      )}
                    </p>
                  )}

                  <div className="wait-stat-box">
                    <div className="wait-label">Current Estimated Wait</div>
                    <div className="wait-value">
                      {place.estimatedWait}{' '}
                      <span style={{ fontSize: '1rem', fontWeight: 600 }}>mins</span>
                    </div>
                  </div>

                  <div className="best-time-box">
                    <div className="best-time-title">
                      <span>⭐ Best Time Today:</span>
                    </div>
                    <div className="best-time-val">{place.bestTime}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      Expected Waiting: ~{place.expectedWaitAtBest} mins
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    <span>🕒 {place.openingTime} – {place.closingTime}</span>
                    <span>🏛️ {place.counters} Counters</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/places/${place.id}`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                      Details
                    </Link>
                    <Link href={`/report?placeId=${place.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Report Wait
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}