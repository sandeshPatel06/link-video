import LegalPage from "./LegalPage";
import { usePageMeta } from "../hooks/usePageMeta";

export default function PrivacyPolicy() {
  usePageMeta("Privacy Policy", "Learn how VidScript collects, processes, and protects your personal data under GDPR and India's DPDP Act 2023.");

  return (
    <LegalPage title="Privacy Policy">
      <p className="legal-updated">Last Updated: September 28, 2026</p>

      <h2>1. Introduction</h2>
      <p>
        VidScript, operated by <strong>SHP Technology</strong> ("we", "our", or "us"), is dedicated to protecting your privacy. This Privacy Policy describes how we collect, process, store, and safeguard your personal information when you use our web application and services. We comply with applicable data protection laws, including the European Union General Data Protection Regulation (EU GDPR), UK GDPR, and India's Digital Personal Data Protection Act (DPDP Act 2023).
      </p>

      <h2>2. Data We Collect (Data Minimization)</h2>
      <p>
        We strictly adhere to the principle of data minimization and collect only the information necessary to provide the transcription service:
      </p>
      <ul>
        <li><strong>Media Files &amp; URLs:</strong> Audio/video files uploaded or URLs provided by you strictly for processing and generating transcripts.</li>
        <li><strong>Usage &amp; Diagnostic Data:</strong> IP address, browser type, device information, and interactions through Google Analytics (only after your explicit consent).</li>
        <li><strong>Advertising &amp; Cookie Data:</strong> Pseudonymous ad identifiers and interaction data via Google Ads (only upon consent).</li>
      </ul>

      <h2>3. How We Process Media Files &amp; Storage</h2>
      <p>
        Uploaded media files and URLs are processed in isolated temporary memory and storage buffers on our servers solely to extract audio and generate transcript text. Temporary media files are automatically purged after processing completes. We never use your proprietary media or generated transcripts to train artificial intelligence models without your explicit opt-in consent.
      </p>

      <h2>4. Cookies, Analytics &amp; Google Ads</h2>
      <p>
        We utilize Google Analytics and Google Ads conversion tracking. In accordance with Google Consent Mode v2 and global privacy regulations, cookies and identifiers for analytical and personalized advertising purposes are disabled by default until you grant affirmative consent via our Cookie Banner. You can modify your consent preferences at any time using the "Cookie Preferences" link in the footer.
      </p>

      <h2>5. Your Rights (GDPR &amp; India DPDP Act 2023)</h2>
      <p>Depending on your jurisdiction, you have the following rights regarding your personal data:</p>
      <ul>
        <li><strong>Right to Access &amp; Summary:</strong> Request confirmation of processing and a summary of your data.</li>
        <li><strong>Right to Correction &amp; Erasure:</strong> Request correction of inaccurate data or deletion of stored data.</li>
        <li><strong>Right to Withdraw Consent:</strong> Revoke previously granted consent at any time without affecting past processing.</li>
        <li><strong>Right to Grievance Redressal:</strong> File a complaint directly with our designated Grievance Officer or the Data Protection Board of India.</li>
        <li><strong>Right to Nominate:</strong> Under the DPDP Act, nominate another person to exercise rights in the event of incapacity or demise.</li>
      </ul>

      <h2>6. Grievance Redressal Officer (India DPDP Act Requirement)</h2>
      <p>
        In accordance with the Digital Personal Data Protection Act 2023, the details of our Data Protection &amp; Grievance Redressal Officer are as follows:
      </p>
      <div className="legal-contact-card">
        <p><strong>Officer:</strong> Harsh Patel (Grievance Officer &amp; Founder)</p>
        <p><strong>Designation:</strong> Data Protection Point of Contact</p>
        <p><strong>Entity:</strong> SHP Technology</p>
        <p><strong>Address:</strong> 1st floor, Near Underground Bridge, Madan Mahal Station, Jabalpur, Madhya Pradesh 482001, India</p>
        <p><strong>Email:</strong> <a href="mailto:grievance@shptechnology.online">grievance@shptechnology.online</a></p>
        <p><strong>Phone:</strong> <a href="tel:+919301885654">+91 9301885654</a></p>
        <p><strong>Response Timeline:</strong> Grievances will be acknowledged within 24 hours and addressed within 30 days.</p>
      </div>

      <h2>7. Contact Us</h2>
      <p>
        If you have any questions, inquiries, or requests regarding this Privacy Policy, please email us at{" "}
        <a href="mailto:privacy@shptechnology.online">privacy@shptechnology.online</a> or{" "}
        <a href="mailto:hello@shptechnology.online">hello@shptechnology.online</a>.
      </p>
    </LegalPage>
  );
}
