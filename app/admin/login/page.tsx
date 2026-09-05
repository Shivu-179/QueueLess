'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, expectedRole: 'ADMIN' }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Administrator authentication failed.');
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('queueless_token', data.token);
        localStorage.setItem('queueless_user', JSON.stringify(data.user));
      }

      setSuccess('Administrator access verified! Loading Dashboard...');
      setTimeout(() => {
        router.push('/admin');
        router.refresh();
      }, 800);
    } catch {
      setError('Network connection error. Server could not be reached.');
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card" style={{ border: '2px solid #1e293b' }}>
        <div className="auth-header">
          <div style={{ display: 'inline-block', background: '#0f172a', color: '#38bdf8', padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            🛡️ OFFICIAL ADMIN PORTAL
          </div>
          <h1 className="auth-title">Administrator Sign In</h1>
          <p className="auth-desc">Secure access for hospital, bank, and government facility managers.</p>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}
        {success && <div className="alert-box alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="adminEmail">Official Admin Email</label>
            <input
              id="adminEmail"
              type="email"
              required
              className="form-input"
              placeholder="admin@facility.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="adminPassword">Master Password</label>
            <input
              id="adminPassword"
              type="password"
              required
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-secondary"
            style={{ width: '100%', marginTop: '0.5rem', background: '#0f172a' }}
          >
            {isLoading ? 'Verifying Credentials...' : 'Sign In to Command Portal'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Need to register a new administrator account?{' '}
          <Link href="/admin/register" style={{ color: '#2563eb', fontWeight: 700 }}>
            Register as Admin here
          </Link>
        </div>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Are you a public citizen?</span>
          <div style={{ marginTop: '0.35rem' }}>
            <Link href="/login" style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.88rem' }}>
              👤 Switch to Citizen User Login &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

