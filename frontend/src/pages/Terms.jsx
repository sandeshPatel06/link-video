import LegalPage from "./LegalPage";
import { usePageMeta } from "../hooks/usePageMeta";

export default function Terms() {
  usePageMeta("Terms & Conditions", "Terms of service, user representations, AI transcription accuracy disclaimers, and liability guidelines for VidScript.");

  return (
    <LegalPage title="Terms &amp; Conditions">
      <p className="legal-updated">Last Updated: September 28, 2026</p>

      <h2>1. Agreement to Terms</h2>
      <p>
        These Terms &amp; Conditions ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and <strong>SHP Technology</strong> ("we", "us", or "our"), concerning your access to and use of the VidScript web application and services. By accessing our service, you confirm that you have read, understood, and agreed to be bound by these Terms.
      </p>

      <h2>2. Permitted Use &amp; Intellectual Property Rights</h2>
      <p>
        You are granted a non-exclusive, non-transferable, revocable license to access and use VidScript strictly in accordance with these Terms. You retain full ownership and intellectual property rights in the media you submit and the resulting transcripts produced.
      </p>

      <h2>3. User Representations &amp; Content Warranties</h2>
      <p>By using the service, you represent and warrant that:</p>
      <ul>
        <li>You hold all necessary copyrights, licenses, or permissions for any audio, video, or URL submitted for transcription.</li>
        <li>Your use of the service does not violate any applicable local, state, national, or international law or regulation.</li>
        <li>You will not upload or transmit material that contains malicious software, viruses, defamatory, or unlawful content.</li>
        <li>You will not circumvent, disable, or tamper with security or rate-limiting features of the service.</li>
      </ul>

      <h2>4. Disclaimers of Accuracy &amp; Automated Processing</h2>
      <p>
        Transcription results are generated using automated speech-to-text algorithms and neural acoustic models. While we endeavor to provide industry-leading accuracy, transcriptions may contain inaccuracies due to background noise, accents, audio compression, or overlapping speech. The service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        In no event will <strong>SHP Technology</strong>, its founders, directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the service or reliance on generated transcripts.
      </p>

      <h2>6. Third-Party Links &amp; Advertisements</h2>
      <p>
        The service may feature advertisements delivered via Google Ads and links to third-party websites or services. We are not responsible for the contents, products, privacy practices, or policies of third parties.
      </p>

      <h2>7. Governing Law &amp; Dispute Resolution</h2>
      <p>
        These Terms shall be governed by and construed in accordance with the laws of India. Any legal action or proceeding arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts in <strong>Jabalpur, Madhya Pradesh, India</strong>.
      </p>

      <h2>8. Modifications to Terms</h2>
      <p>
        We reserve the right to amend or update these Terms at any time. Changes become effective immediately upon posting. Your continued use of the service constitutes acceptance of modified terms.
      </p>

      <h2>9. Contact Information</h2>
      <p>
        For inquiries regarding these Terms &amp; Conditions, please reach us at{" "}
        <a href="mailto:contact@shptechnology.online">contact@shptechnology.online</a> or{" "}
        <a href="mailto:hello@shptechnology.online">hello@shptechnology.online</a>.
      </p>
    </LegalPage>
  );
}
