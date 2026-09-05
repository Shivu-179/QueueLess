import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        <div className="footer-brand">
          <h3>⏱ QueueLess</h3>
          <p>
            Smart Crowd & Waiting Time Prediction System. Empowering citizens to avoid long queues in public services and institutions.
          </p>
        </div>

        <div className="footer-col">
          <h4>Public Sectors</h4>
          <ul className="footer-links">
            <li><Link href="/places?category=hospital">Hospitals & Clinics</Link></li>
            <li><Link href="/places?category=bank">Banks & Financial</Link></li>
            <li><Link href="/places?category=govt">Government Offices</Link></li>
            <li><Link href="/places?category=college">College Administration</Link></li>
            <li><Link href="/places?category=transit">Railway Stations & Transit</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Quick Navigation</h4>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/places">Explore Places</Link></li>
            <li><Link href="/report">Submit Crowd Report</Link></li>
            <li><Link href="/admin">Admin Portal</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Live Services</h4>
          <ul className="footer-links">
            <li><Link href="/places">Real-Time Queue Wait</Link></li>
            <li><Link href="/report">Report Community Crowd</Link></li>
            <li><Link href="/login">User & Admin Sign In</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 QueueLess – Smart Crowd & Waiting Time Prediction System. All rights reserved.</div>
      </div>
    </footer>
  );
}