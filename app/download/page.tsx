'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Download, Smartphone, Laptop, Apple, ArrowLeft, ShieldCheck, Wifi, Check, ExternalLink, Globe } from 'lucide-react';

export default function DownloadPage() {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'laptop'>('android');

  return (
    <div className="dl-section" style={{ minHeight: 'calc(100vh - 140px)', background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1rem' }}>
      <div className="dl-card" style={{ maxWidth: 580, width: '100%', background: '#ffffff', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.03)', padding: '2.25rem', boxSizing: 'border-box' }}>
        
        {/* Header Area */}
        <div className="dl-header-area" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="dl-icon-circle" style={{ width: 60, height: 60, borderRadius: 18, background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem auto', border: '1px solid #bfdbfe' }}>
            <Smartphone style={{ width: 28, height: 28 }} />
          </div>
          <h1 className="dl-title" style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '0.35rem' }}>Get QueueLess App</h1>
          <p className="dl-subtitle" style={{ fontSize: '0.92rem', color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
            Smart crowd and waiting time predictions on all your devices.
          </p>
        </div>

        {/* Device Switcher Tabs */}
        <div className="dl-tabs-nav" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, background: '#f1f5f9', padding: 6, borderRadius: 16, marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setActiveTab('android')}
            className={`dl-tab-btn ${activeTab === 'android' ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '0.65rem 0.5rem',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'android' ? '#ffffff' : 'transparent',
              color: activeTab === 'android' ? '#1d4ed8' : '#64748b',
              fontWeight: activeTab === 'android' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'android' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Smartphone style={{ width: 16, height: 16, color: activeTab === 'android' ? '#16a34a' : '#64748b' }} />
            <span>Android</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ios')}
            className={`dl-tab-btn ${activeTab === 'ios' ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '0.65rem 0.5rem',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'ios' ? '#ffffff' : 'transparent',
              color: activeTab === 'ios' ? '#0f172a' : '#64748b',
              fontWeight: activeTab === 'ios' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'ios' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Apple style={{ width: 16, height: 16, color: activeTab === 'ios' ? '#0f172a' : '#64748b' }} />
            <span>iPhone / iOS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('laptop')}
            className={`dl-tab-btn ${activeTab === 'laptop' ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '0.65rem 0.5rem',
              borderRadius: 12,
              border: 'none',
              background: activeTab === 'laptop' ? '#ffffff' : 'transparent',
              color: activeTab === 'laptop' ? '#2563eb' : '#64748b',
              fontWeight: activeTab === 'laptop' ? 700 : 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: activeTab === 'laptop' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Laptop style={{ width: 16, height: 16, color: activeTab === 'laptop' ? '#2563eb' : '#64748b' }} />
            <span>Laptop / PC</span>
          </button>
        </div>

        {/* Tab 1: Android APK */}
        {activeTab === 'android' && (
          <div>
            {/* Specs Box */}
            <div className="dl-specs-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1rem 1.15rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div className="dl-spec-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <span className="dl-spec-label" style={{ color: '#64748b', fontWeight: 600 }}>Package Name:</span>
                <span className="dl-spec-val mono" style={{ fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600, color: '#0f172a' }}>QueueLess.apk</span>
              </div>
              <div className="dl-spec-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <span className="dl-spec-label" style={{ color: '#64748b', fontWeight: 600 }}>File Size:</span>
                <span className="dl-spec-val" style={{ color: '#16a34a', fontWeight: 700 }}>
                  3.86 MB (Ultra-Light)
                </span>
              </div>
              <div className="dl-spec-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <span className="dl-spec-label" style={{ color: '#64748b', fontWeight: 600 }}>Target OS:</span>
                <span className="dl-spec-val" style={{ color: '#0f172a', fontWeight: 600 }}>Android 6.0 to 15.0</span>
              </div>
              <div className="dl-spec-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <span className="dl-spec-label" style={{ color: '#64748b', fontWeight: 600 }}>Live Wi-Fi Sync:</span>
                <span className="dl-spec-val mono" style={{ color: '#2563eb', display: 'flex', alignItems: 'center', fontFamily: 'monospace', background: '#ffffff', border: '1px solid #e2e8f0', padding: '2px 6px', borderRadius: 6, fontSize: '0.78rem', fontWeight: 600 }}>
                  <Wifi style={{ width: 14, height: 14, marginRight: 4 }} /> 10.119.2.183:3000
                </span>
              </div>
            </div>

            {/* Direct Download Button */}
            <a href="/api/download" className="dl-btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '0.95rem 1.5rem', borderRadius: 16, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.35)', boxSizing: 'border-box' }}>
              <Download style={{ width: 20, height: 20 }} />
              <span>Download Android APK (3.86 MB)</span>
            </a>

            {/* QR Code Scanner Card */}
            <div className="dl-qr-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0', textAlign: 'left' }}>
              <img
                src="/qr-download.png"
                alt="Scan QR to Download APK"
                className="dl-qr-img"
                style={{ width: 110, height: 110, maxWidth: 110, maxHeight: 110, borderRadius: 12, border: '1px solid #e2e8f0', padding: 4, background: '#ffffff', flexShrink: 0, objectFit: 'contain' }}
              />
              <div className="dl-qr-info" style={{ flex: 1 }}>
                <div className="dl-qr-title" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>📱 Scan with Phone Camera</div>
                <div className="dl-qr-desc" style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.45, marginBottom: '0.4rem' }}>
                  Open your phone camera or Google Lens and point it here to download <strong>QueueLess.apk</strong> straight to your phone.
                </div>
                <div className="dl-qr-url" style={{ fontFamily: 'monospace', fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', wordBreak: 'break-all' }}>http://10.119.2.183:3000/api/download</div>
              </div>
            </div>

            {/* Installation Instructions */}
            <div className="dl-guide-box" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 16, padding: '1rem 1.25rem', textAlign: 'left', marginTop: '1rem' }}>
              <div className="dl-guide-title" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check style={{ width: 16, height: 16, color: '#16a34a' }} />
                <span>How to Install on Android Phone:</span>
              </div>
              <div className="dl-step-item" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: '0.55rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                <span className="dl-step-num" style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>1</span>
                <span>Tap the <strong>Download APK</strong> button or scan the QR code.</span>
              </div>
              <div className="dl-step-item" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: '0.55rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                <span className="dl-step-num" style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>2</span>
                <span>Tap the downloaded file in your browser downloads or notification bar.</span>
              </div>
              <div className="dl-step-item" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: '0.55rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45 }}>
                <span className="dl-step-num" style={{ width: 20, height: 20, borderRadius: '50%', background: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>3</span>
                <span>Tap <strong>Install</strong> (enable <em>&ldquo;Allow from this source&rdquo;</em> if Android asks).</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: iPhone / iOS */}
        {activeTab === 'ios' && (
          <div>
            <div className="dl-specs-box" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <div style={{ fontWeight: 700, color: '#1e40af', fontSize: '0.88rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Apple style={{ width: 16, height: 16, color: '#0f172a' }} />
                <span>Why iPhones Use Progressive Web Apps (PWA):</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5 }}>
                Apple blocks installing APK files. Instead, QueueLess installs directly from Safari onto your iPhone Home Screen with an app icon and full-screen view!
              </div>
            </div>

            <div className="dl-guide-box">
              <div className="dl-guide-title">
                <Smartphone style={{ width: 16, height: 16, color: '#2563eb' }} />
                <span>3 Easy Steps to Install on iPhone:</span>
              </div>
              <div className="dl-step-item">
                <span className="dl-step-num">1</span>
                <div>
                  Open <strong>Safari</strong> on your iPhone and go to:
                  <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', padding: '4px 8px', borderRadius: 6, fontWeight: 700, color: '#2563eb', marginTop: 4, fontFamily: 'monospace' }}>
                    http://10.119.2.183:3000
                  </div>
                </div>
              </div>
              <div className="dl-step-item">
                <span className="dl-step-num">2</span>
                <span>Tap the <strong>Share button</strong> at the bottom of Safari (the square icon with an upward arrow ⎋).</span>
              </div>
              <div className="dl-step-item">
                <span className="dl-step-num">3</span>
                <span>Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then press <strong>Add</strong>.</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '1rem' }}>
              ✨ The QueueLess icon will appear on your iPhone screen and run full-screen without address bars!
            </div>
          </div>
        )}

        {/* Tab 3: Laptop / PC */}
        {activeTab === 'laptop' && (
          <div>
            <div className="dl-specs-box">
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Laptop style={{ width: 16, height: 16, color: '#2563eb' }} />
                <span>Laptop &amp; Desktop Browser Access:</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                Access the full QueueLess portal from any computer browser:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b' }}>On this laptop: </span>
                  <a href="http://localhost:3000" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#2563eb', textDecoration: 'underline' }}>
                    http://localhost:3000
                  </a>
                </div>
                <div style={{ fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b' }}>On other laptops on your Wi-Fi: </span>
                  <a href="http://10.119.2.183:3000" target="_blank" rel="noreferrer" style={{ fontWeight: 700, color: '#2563eb', textDecoration: 'underline' }}>
                    http://10.119.2.183:3000
                  </a>
                </div>
              </div>
            </div>

            <div className="dl-guide-box" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <div className="dl-guide-title" style={{ color: '#166534' }}>
                <Check style={{ width: 16, height: 16, color: '#16a34a' }} />
                <span>Install as Standalone Desktop App (Chrome / Edge):</span>
              </div>
              <div className="dl-step-item" style={{ color: '#14532d' }}>
                <span className="dl-step-num" style={{ background: '#16a34a' }}>1</span>
                <span>Look at the right side of the URL address bar at the top of your browser.</span>
              </div>
              <div className="dl-step-item" style={{ color: '#14532d' }}>
                <span className="dl-step-num" style={{ background: '#16a34a' }}>2</span>
                <span>Click the <strong>Install icon</strong> (a computer monitor with an arrow 📥).</span>
              </div>
              <div className="dl-step-item" style={{ color: '#14532d' }}>
                <span className="dl-step-num" style={{ background: '#16a34a' }}>3</span>
                <span>Click <strong>Install</strong>. QueueLess will open in its own clean window and add an icon to your Windows Desktop!</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <Link href="/" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', borderRadius: 14, fontSize: '0.95rem' }}>
                <Globe style={{ width: 18, height: 18, marginRight: 8 }} />
                <span>Open Web Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {/* Footer Area */}
        <div className="dl-footer-area">
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', color: '#64748b', fontWeight: 600 }}>
            <ArrowLeft style={{ width: 14, height: 14, marginRight: 6 }} />
            <span>Back to Home</span>
          </Link>
          <span style={{ display: 'inline-flex', alignItems: 'center', color: '#16a34a', fontWeight: 700 }}>
            <ShieldCheck style={{ width: 16, height: 16, marginRight: 4 }} />
            <span>Official &amp; Verified</span>
          </span>
        </div>

      </div>
    </div>
  );
}
