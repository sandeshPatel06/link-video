/**
 * Cookie consent hook — GDPR & India DPDP Act 2023 compliant.
 * Stores consent in localStorage under "lv_consent".
 * Fires Google Consent Mode v2 updates when consent changes.
 */

const CONSENT_KEY = "lv_consent";

export function getStoredConsent() {
  try {
    return JSON.parse(localStorage.getItem(CONSENT_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveConsent(prefs) {
  const consent = { ...prefs, timestamp: Date.now(), version: "1" };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  applyGoogleConsent(consent);
  return consent;
}

export function hasConsented() {
  return getStoredConsent() !== null;
}

/** Apply Google Consent Mode v2 signals */
export function applyGoogleConsent(prefs) {
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: prefs.analytics ? "granted" : "denied",
    ad_storage: prefs.marketing ? "granted" : "denied",
    ad_user_data: prefs.marketing ? "granted" : "denied",
    ad_personalization: prefs.marketing ? "granted" : "denied",
  });
}

/** Call once on app start to re-apply stored consent */
export function initConsent() {
  const stored = getStoredConsent();
  if (stored) applyGoogleConsent(stored);
}
