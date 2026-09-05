'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const checkUser = () => {
      const stored = localStorage.getItem('queueless_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('queueless_token');
    localStorage.removeItem('queueless_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="navbar-header">
      <nav className="nav-container">
        <Link href="/" className="brand-logo">
          <span>⏱ QueueLess</span>
          <span className="brand-badge">Smart Crowd</span>
        </Link>

        <ul className="nav-menu">
          <li>
            <Link href="/" className="nav-link">Home</Link>
          </li>
          <li>
            <Link href="/places" className="nav-link">Find Places</Link>
          </li>
          <li>
            <Link href="/report" className="nav-link">Report Wait Time</Link>
          </li>
          {user?.role === 'ADMIN' && (
            <li>
              <Link href="/admin" className="nav-link" style={{ color: '#c2410c', fontWeight: 700 }}>
                Admin Portal
              </Link>
            </li>
          )}
        </ul>

        <div className="nav-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                👤 {user.name.split(' ')[0]} {user.role === 'ADMIN' && '(Admin)'}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href="/login" className="btn btn-outline btn-sm">
                User Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
              <Link href="/admin/login" className="btn btn-secondary btn-sm" style={{ background: '#0f172a' }}>
                🛡️ Admin
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}