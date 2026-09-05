'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Home, MapPin, Clock, Download, Shield, User, LogOut, Smartphone } from 'lucide-react';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <nav className="nav-container">
        {/* Brand Logo with Smart Crowd badge */}
        <Link href="/" className="brand-logo" onClick={closeMenu}>
          <span className="brand-icon">⏱</span>
          <span className="brand-text">QueueLess</span>
          <span className="brand-badge">Smart Crowd</span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="nav-menu desktop-only">
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
              <Link href="/admin" className="nav-link nav-link-admin">
                🛡️ Admin Portal
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop Action Buttons */}
        <div className="nav-actions desktop-only">
          <Link href="/download" className="nav-app-pill" title="Download Mobile App">
            <Download className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            <span>Get App</span>
          </Link>

          {user ? (
            <div className="user-profile-widget">
              <span className="user-greeting">
                👤 {user.name.split(' ')[0]} {user.role === 'ADMIN' && <span className="admin-tag">Admin</span>}
              </span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div className="guest-actions">
              <Link href="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
              <Link href="/admin/login" className="btn btn-secondary btn-sm admin-btn">
                🛡️ Admin
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Right Controls: Sleek Get App pill + Hamburger Toggle */}
        <div className="mobile-header-actions">
          <Link href="/download" className="mobile-quick-app-btn" onClick={closeMenu}>
            <Smartphone className="w-3.5 h-3.5 mr-1 text-blue-600" />
            <span>Get App</span>
          </Link>

          <button
            type="button"
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer / Slide-Down Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={closeMenu}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            {/* User status card if logged in */}
            {user ? (
              <div className="mobile-user-card">
                <div className="mobile-user-avatar">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="mobile-user-info">
                  <div className="mobile-user-name">{user.name}</div>
                  <div className="mobile-user-email">
                    {user.email} {user.role === 'ADMIN' && <span className="admin-pill">Admin</span>}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Nav Links List */}
            <div className="mobile-links-list">
              <Link href="/" className="mobile-nav-item" onClick={closeMenu}>
                <Home className="w-4 h-4 text-blue-600 mr-3" />
                <span>Home</span>
              </Link>

              <Link href="/places" className="mobile-nav-item" onClick={closeMenu}>
                <MapPin className="w-4 h-4 text-emerald-600 mr-3" />
                <span>Find Places & Facilities</span>
              </Link>

              <Link href="/report" className="mobile-nav-item" onClick={closeMenu}>
                <Clock className="w-4 h-4 text-amber-600 mr-3" />
                <span>Report Current Wait Time</span>
              </Link>

              <Link href="/download" className="mobile-nav-item mobile-app-highlight" onClick={closeMenu}>
                <Smartphone className="w-4 h-4 text-blue-600 mr-3" />
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <span className="font-bold">Install Mobile App</span>
                    <span className="block text-[11px] text-slate-500 font-normal">Android APK &amp; iOS PWA</span>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">3.8 MB</span>
                </div>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="mobile-nav-item mobile-admin-highlight" onClick={closeMenu}>
                  <Shield className="w-4 h-4 text-orange-600 mr-3" />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </div>

            {/* Bottom Actions on Mobile */}
            <div className="mobile-menu-footer">
              {user ? (
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              ) : (
                <div className="mobile-auth-grid">
                  <Link href="/login" className="btn btn-outline w-full" onClick={closeMenu}>
                    User Login
                  </Link>
                  <Link href="/register" className="btn btn-primary w-full" onClick={closeMenu}>
                    Register
                  </Link>
                  <Link href="/admin/login" className="btn btn-secondary w-full col-span-2" onClick={closeMenu}>
                    🛡️ Facility Admin Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}