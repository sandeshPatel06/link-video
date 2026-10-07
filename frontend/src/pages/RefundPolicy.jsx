import LegalPage from "./LegalPage";
import { usePageMeta } from "../hooks/usePageMeta";

export default function RefundPolicy() {
  usePageMeta("Refund Policy", "Details on free tier ad-supported usage, paid transaction refund eligibility, and cancellation procedures.");

  return (
    <LegalPage title="Refund &amp; Cancellation Policy">
      <p className="legal-updated">Last Updated: September 28, 2026</p>

      <h2>1. Overview</h2>
      <p>
        Thank you for choosing VidScript. We strive to provide reliable and efficient transcription services. This policy outlines the terms and conditions regarding refunds and cancellations for our services.
      </p>

      <h2>2. Free Tier &amp; Ad-Supported Usage</h2>
      <p>
        VidScript provides accessible transcription options supported by advertising. For free or ad-supported transcriptions, no financial charges are applied; consequently, monetary refund provisions do not apply to free tiers.
      </p>

      <h2>3. Premium &amp; Paid Services (If Applicable)</h2>
      <p>
        In the event you purchase paid credits, subscription plans, or extended processing tiers:
      </p>
      <ul>
        <li><strong>Service Failure:</strong> If a job fails due to a server-side error, unrecoverable system exception, or processing crash where no usable transcript was produced, credits or the transaction amount will be automatically refunded or re-credited to your account.</li>
        <li><strong>Cancellation of Pending Jobs:</strong> You may cancel a processing job before transcription has commenced. Once transcription processing is initiated, compute resources have been utilized and the request cannot be canceled.</li>
        <li><strong>Quality Concerns:</strong> Transcription quality depends heavily on audio clarity, speaker volume, background noise, and accents. We cannot offer refunds for poor transcription output resulting from corrupted, distorted, or unintelligible source audio.</li>
      </ul>

      <h2>4. Refund Request Procedure</h2>
      <p>
        To request a refund or dispute a charge, submit a request within 7 business days of the transaction to{" "}
        <a href="mailto:billing@shptechnology.online">billing@shptechnology.online</a> with:
      </p>
      <ul>
        <li>Transaction ID or Receipt Number</li>
        <li>Job ID and Date of Processing</li>
        <li>A concise description of the issue encountered</li>
      </ul>
      <p>
        Approved refunds are processed to the original payment method within 5 to 7 business days in accordance with Indian banking and gateway settlement guidelines.
      </p>

      <h2>5. Questions</h2>
      <p>
        For inquiries regarding billing or cancellations, please contact us at{" "}
        <a href="mailto:billing@shptechnology.online">billing@shptechnology.online</a>.
      </p>
    </LegalPage>
  );
}
