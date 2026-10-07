import LegalPage from "./LegalPage";
import { usePageMeta } from "../hooks/usePageMeta";

export default function CookiePolicy() {
  usePageMeta("Cookie Policy", "Information regarding strictly necessary, analytical, and Google Ads marketing cookies used on VidScript.");

  return (
    <LegalPage title="Cookie Policy">
      <p className="legal-updated">Last Updated: September 28, 2026</p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are stored on your device when you browse websites. They are commonly used to remember preferences, analyze website traffic, ensure security, and serve personalized advertising.
      </p>

      <h2>2. Categories of Cookies We Use</h2>
      <div className="legal-table-wrapper">
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Purpose</th>
              <th scope="col">Lifespan</th>
              <th scope="col">Default Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Strictly Necessary</strong></td>
              <td>Essential for core functionality, security, session management, and remembering consent preferences.</td>
              <td>Up to 12 months</td>
              <td>Always Active</td>
            </tr>
            <tr>
              <td><strong>Analytics &amp; Performance</strong></td>
              <td>Measures page visits, performance metrics, and user interactions via Google Analytics to help us improve our platform.</td>
              <td>Up to 24 months</td>
              <td>Disabled (Opt-In)</td>
            </tr>
            <tr>
              <td><strong>Marketing &amp; Advertising</strong></td>
              <td>Used by Google Ads and third-party advertising partners to deliver tailored advertisements and gauge campaign effectiveness.</td>
              <td>Up to 24 months</td>
              <td>Disabled (Opt-In)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. Google Ads &amp; Consent Mode v2</h2>
      <p>
        We employ Google Consent Mode v2. When you visit our website, ad cookies, ad user data, and personalization parameters (<code>ad_storage</code>, <code>ad_user_data</code>, <code>ad_personalization</code>) remain in a denied state until you grant affirmative consent via our Cookie Banner.
      </p>

      <h2>4. Managing and Revoking Cookie Consent</h2>
      <p>
        You have complete control over non-essential cookies. You can update or withdraw your consent at any time by clicking the <strong>Cookie Preferences</strong> link located in the footer of any page. Furthermore, you can configure your web browser to reject cookies or delete existing cookies.
      </p>

      <h2>5. Updates to this Cookie Policy</h2>
      <p>
        We may update this Cookie Policy periodically to reflect technological, operational, or legal developments. Please check this page regularly.
      </p>

      <h2>6. Inquiries</h2>
      <p>
        If you have questions about our use of cookies, contact us at{" "}
        <a href="mailto:privacy@shptechnology.online">privacy@shptechnology.online</a> or{" "}
        <a href="mailto:hello@shptechnology.online">hello@shptechnology.online</a>.
      </p>
    </LegalPage>
  );
}
