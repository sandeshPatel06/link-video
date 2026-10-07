import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <Link to="/" className="app-logo" aria-label="VidScript home">
          <div className="app-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="url(#logo-grad)" opacity="0.25"/>
              <path d="M10 8.5v7l5.5-3.5L10 8.5z" fill="url(#logo-grad)"/>
              <defs>
                <linearGradient id="logo-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="app-logo-text">
            <span className="app-logo-name">VidScript</span>
            <span className="app-logo-sub">AI</span>
          </div>
        </Link>

        <div className="app-header-center">
          <span className="system-status-pill">
            <span className="status-dot"></span>
            Video to Script Engine Online
          </span>
        </div>

        <nav className="app-header-right" aria-label="Site navigation">
          <Link to="/privacy" className="header-nav-link">Privacy</Link>
          <Link to="/terms" className="header-nav-link">Terms</Link>
          <Link to="/refund" className="header-nav-link">Refunds</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
