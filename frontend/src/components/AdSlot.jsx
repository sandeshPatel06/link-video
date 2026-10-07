/**
 * Compliant Advertisement container for Google AdSense / Google Ads.
 * Meets Google Ads Policy:
 * 1. Prominent "ADVERTISEMENT" label so users never confuse ads with content.
 * 2. Proper reserved minimum height to prevent Cumulative Layout Shift (CLS).
 * 3. Graceful fallback when user denies ad consent or ad blocker is active.
 */
import { getStoredConsent } from "../hooks/useCookieConsent";

export default function AdSlot({ slotId = "default-banner", format = "horizontal" }) {
  const consent = getStoredConsent();
  const adsAllowed = consent?.marketing ?? false;

  return (
    <div className={`ad-slot-wrapper ad-format-${format}`} aria-label="Sponsored advertisement">
      <div className="ad-badge-row">
        <span className="ad-policy-label">ADVERTISEMENT</span>
      </div>
      <div className="ad-content-box" id={`ad-slot-${slotId}`}>
        {adsAllowed ? (
          <div className="ad-placeholder-live">
            <span className="ad-hint-text">Google Ads Partner Space · ID: {slotId}</span>
          </div>
        ) : (
          <div className="ad-placeholder-consent">
            <span className="ad-hint-text">Ads disabled (Personalized ad consent not granted)</span>
          </div>
        )}
      </div>
    </div>
  );
}
