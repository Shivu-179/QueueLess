'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserLoginPage() {
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid credentials. Please try again.');
        setIsLoading(false);
        return;
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('queueless_token', data.token);
        localStorage.setItem('queueless_user', JSON.stringify(data.user));
      }

      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 800);
    } catch {
      setError('Network error. Could not connect to the server.');
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ display: 'inline-block', background: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            👤 CITIZEN USER PORTAL
          </div>
          <h1 className="auth-title">Citizen Sign In</h1>
          <p className="auth-desc">Sign in to check live queues, report wait times, and write reviews.</p>
        </div>

        {error && <div className="alert-box alert-error">{error}</div>}
        {success && <div className="alert-box alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: '1rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
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
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In as Citizen'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
          Don&apos;t have a citizen account?{' '}
          <Link href="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
            Register here
          </Link>
        </div>

        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Are you a Facility Official or Staff?</span>
          <div style={{ marginTop: '0.35rem' }}>
            <Link href="/admin/login" style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.88rem' }}>
              🛡️ Go to Admin Login Portal &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}