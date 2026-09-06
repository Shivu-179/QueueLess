import Link from 'next/link';
import { getPlaces } from '@/lib/data-service';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const places = await getPlaces();

  const getBadge = (level: string) => {
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

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-pill">
            <span>✨ Live Crowd & Queue Estimator</span>
          </div>

          <h1 className="hero-title">
            <span>Queue</span>Less
          </h1>
          <p className="hero-subtitle">
            &ldquo;Know the crowd. Choose the right time.&rdquo;
          </p>
          <p className="hero-description">
            Never wait in frustrating lines again. QueueLess calculates real-time crowd levels, predicts waiting times using community reports, and recommends the optimal time to visit.
          </p>

          <div className="hero-buttons">
            <Link href="/places" className="btn btn-primary btn-lg">
              Find Places
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Login
            </Link>
            <Link href="/register" className="btn btn-outline btn-lg">
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Live Crowd Status Preview Section */}
      <section className="preview-section">
        <div className="section-header">
          <h2 className="section-title">Live Crowd Status Today</h2>
          <p className="section-desc">
            Real-time estimated waiting times and best visiting hours for public facilities.
          </p>
        </div>

        {places.length === 0 ? (
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', padding: '3.5rem 2rem', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '3rem' }}>🏢</span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.75rem', color: '#0f172a' }}>
              Database is Fresh & Clean
            </h3>
            <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
              All demo records have been cleared. You can now register your own <strong>Admin</strong> or <strong>Citizen</strong> account and start adding hospitals, banks, and public offices.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn btn-primary">
                🛡️ Register as Admin
              </Link>
              <Link href="/register" className="btn btn-outline">
                👤 Register as Citizen User
              </Link>
            </div>
          </div>
        ) : (
          <div className="cards-grid">
            {places.slice(0, 6).map((place: any) => {
              const badge = getBadge(place.currentCrowd);
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
                    {place.department && (
                      <div style={{ background: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 600, margin: '0.35rem 0' }}>
                        🏢 {place.department}
                      </div>
                    )}
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      📍 {place.roomLocation || place.address}
                    </p>

                    <div className="wait-stat-box">
                      <div className="wait-label">Estimated Waiting Time</div>
                      <div className="wait-value">
                        {place.estimatedWait} <span style={{ fontSize: '1rem', fontWeight: 600 }}>mins</span>
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {place.counters} Counters Active
                    </span>
                    <Link href={`/places/${place.id}`} className="btn btn-outline btn-sm">
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. How QueueLess Works */}
      <section className="how-section">
        <div className="section-header">
          <h2 className="section-title">How QueueLess Works</h2>
          <p className="section-desc">
            Three simple steps to save hours of waiting time every week.
          </p>
        </div>

        <div className="how-grid">
          <div className="how-card">
            <div className="how-step">1</div>
            <h3 className="how-title">Find Your Place</h3>
            <p className="how-text">
              Search for hospitals, banks, government centers, or college offices near you before leaving home.
            </p>
          </div>

          <div className="how-card">
            <div className="how-step">2</div>
            <h3 className="how-title">Check Crowd & Wait Time</h3>
            <p className="how-text">
              See the live crowd level (🟢 Low to 🔴 Very High) and smart predictions of current queue duration.
            </p>
          </div>

          <div className="how-card">
            <div className="how-step">3</div>
            <h3 className="how-title">Report & Help Community</h3>
            <p className="how-text">
              Share your actual waiting time when you visit to keep the prediction accurate for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Supported Sectors / Categories */}
      <section className="category-section">
        <h2 className="section-title">Public Places Supported</h2>
        <p className="section-desc">
          Designed for high-traffic public counters where queues build up quickly.
        </p>

        <div className="category-tags">
          <span className="category-tag">🏥 Hospitals & Clinics</span>
          <span className="category-tag">🏦 Banks & ATMs</span>
          <span className="category-tag">🏛️ Government Offices</span>
          <span className="category-tag">🎓 College & University Offices</span>
          <span className="category-tag">🚆 Railway Stations</span>
          <span className="category-tag">🏢 Public Utilities</span>
        </div>
      </section>
    </div>
  );
}