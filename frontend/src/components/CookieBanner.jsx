import { useState } from "react";
import { saveConsent, getStoredConsent } from "../hooks/useCookieConsent";
import { Link } from "react-router-dom";

export default function CookieBanner({ onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const stored = getStoredConsent();
  const [prefs, setPrefs] = useState({
    necessary: true,
    analytics: stored?.analytics ?? false,
    marketing: stored?.marketing ?? false,
  });

  function acceptAll() {
    saveConsent({ necessary: true, analytics: true, marketing: true });
    onClose();
  }

  function acceptNecessary() {
    saveConsent({ necessary: true, analytics: false, marketing: false });
    onClose();
  }

  function savePreferences() {
    saveConsent(prefs);
    onClose();
  }

  return (
    <div className="cookie-overlay" role="dialog" aria-modal="true" aria-label="Cookie consent">
      <div className="cookie-banner">
        {!showDetails ? (
          <>
            <div className="cookie-text">
              <p className="cookie-title">We use cookies</p>
              <p className="cookie-desc">
                We use cookies to improve your experience and serve relevant ads.
                Read our{" "}
                <Link to="/cookies" className="cookie-link" target="_blank">Cookie Policy</Link>
                {" "}and{" "}
                <Link to="/privacy" className="cookie-link" target="_blank">Privacy Policy</Link>.
              </p>
            </div>
            <div className="cookie-actions">
              <button className="btn-ghost" onClick={() => setShowDetails(true)}>
                Manage Preferences
              </button>
              <button className="btn-secondary" onClick={acceptNecessary}>
                Necessary Only
              </button>
              <button className="btn-primary" onClick={acceptAll}>
                Accept All
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="cookie-text">
              <p className="cookie-title">Cookie Preferences</p>
            </div>
            <div className="cookie-prefs">
              <div className="cookie-pref-row">
                <div>
                  <p className="pref-name">Necessary</p>
                  <p className="pref-desc">Required for the site to work. Cannot be disabled.</p>
                </div>
                <div className="toggle-on" aria-label="Always enabled">On</div>
              </div>
              <div className="cookie-pref-row">
                <div>
                  <p className="pref-name">Analytics</p>
                  <p className="pref-desc">Help us understand how visitors use the site (Google Analytics).</p>
                </div>
                <button
                  className={`toggle ${prefs.analytics ? "toggle-on" : ""}`}
                  onClick={() => setPrefs((p) => ({ ...p, analytics: !p.analytics }))}
                  aria-pressed={prefs.analytics}
                  aria-label="Toggle analytics cookies"
                >
                  {prefs.analytics ? "On" : "Off"}
                </button>
              </div>
              <div className="cookie-pref-row">
                <div>
                  <p className="pref-name">Marketing</p>
                  <p className="pref-desc">Used for personalised ads via Google Ads.</p>
                </div>
                <button
                  className={`toggle ${prefs.marketing ? "toggle-on" : ""}`}
                  onClick={() => setPrefs((p) => ({ ...p, marketing: !p.marketing }))}
                  aria-pressed={prefs.marketing}
                  aria-label="Toggle marketing cookies"
                >
                  {prefs.marketing ? "On" : "Off"}
                </button>
              </div>
            </div>
            <div className="cookie-actions">
              <button className="btn-ghost" onClick={() => setShowDetails(false)}>Back</button>
              <button className="btn-primary" onClick={savePreferences}>Save Preferences</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
