import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">VidScript</span>
            <p className="footer-tagline">
              Fast, accurate AI video to script, video to text, and link to script platform developed by SHP Technology.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <p className="footer-col-title">Legal</p>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms &amp; Conditions</Link>
              <Link to="/cookies" className="footer-link">Cookie Policy</Link>
              <Link to="/refund" className="footer-link">Refund Policy</Link>
            </div>
            <div className="footer-col">
              <p className="footer-col-title">Contact &amp; Office</p>
              <a href="mailto:hello@shptechnology.online" className="footer-link">hello@shptechnology.online</a>
              <a href="tel:+919301885654" className="footer-link">+91 9301885654</a>
              <p className="footer-text">SHP Technology</p>
              <p className="footer-text">1st floor, Near Underground Bridge, Madan Mahal Station</p>
              <p className="footer-text">Jabalpur, Madhya Pradesh 482001, India</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} VidScript by SHP Technology. All rights reserved.</p>
          <p>
            <button
              className="btn-text footer-consent-link"
              onClick={() => {
                localStorage.removeItem("lv_consent");
                window.location.reload();
              }}
            >
              Cookie Preferences
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
