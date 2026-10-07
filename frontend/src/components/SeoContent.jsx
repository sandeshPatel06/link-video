import { useState } from "react";

const FAQS = [
  {
    q: "How do I convert a video to script or video to text?",
    a: "To convert video to script or video to text, paste your YouTube or media URL into VidScript, or upload an audio/video file. Select your language or choose Auto-Detect, and click 'Convert Video to Script'. The AI generates full timestamped text within seconds."
  },
  {
    q: "Can I convert a video link to script directly?",
    a: "Yes! VidScript specializes in link to script conversion. You can paste public URLs from YouTube, Vimeo, Twitter/X, and direct media streams without needing to download the video first."
  },
  {
    q: "What export formats does VidScript support for video to text?",
    a: "You can download your converted video script as Plain Text (.TXT) for notes and articles, SubRip Subtitles (.SRT) for Adobe Premiere Pro and DaVinci Resolve, WebVTT (.VTT) for HTML5 web players, and Structured JSON (.JSON) with millisecond timestamps."
  },
  {
    q: "Is VidScript free to use for video to script conversion?",
    a: "Yes, VidScript provides free ad-supported video to script and video to text conversion with no mandatory sign-ups, watermarks, or hidden fees."
  },
  {
    q: "How accurate is the AI video to text speech recognition?",
    a: "VidScript uses state-of-the-art Whisper transformer models trained on over 680,000 hours of multilingual speech, delivering industry-leading 99% accuracy across diverse regional accents, background noise, and technical jargon."
  },
  {
    q: "Is my media private and protected under DPDP Act and GDPR?",
    a: "Yes. VidScript follows strict privacy principles under India's DPDP Act 2023 and EU GDPR. All media files are processed in temporary, isolated memory buffers and purged immediately following transcription. Your content is never stored permanently or used to train third-party AI models."
  }
];

export default function SeoContent() {
  const [openFaq, setOpenFaq] = useState(null);

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <div className="seo-content-container">
      {/* ─── How It Works (Semantic HTML for Search Engines) ─────────── */}
      <section className="seo-section" aria-labelledby="how-it-works-heading">
        <div className="seo-section-header">
          <span className="section-eyebrow">SEAMLESS 3-STEP CONVERTER</span>
          <h2 id="how-it-works-heading" className="seo-section-title">
            How to Convert Video to Script &amp; Video to Text
          </h2>
          <p className="seo-section-desc">
            Convert YouTube videos, online links, podcasts, and recordings into clean text scripts, video captions, and SRT subtitles in seconds.
          </p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 className="step-heading">Video Link to Script or File Upload</h3>
            <p className="step-body">
              Paste any YouTube link to script, Vimeo URL, Twitter/X clip, or drag and drop local media files including MP4, MP3, WAV, MOV, and M4A.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <h3 className="step-heading">AI Video to Text Speech Engine</h3>
            <p className="step-body">
              Advanced Whisper neural models automatically normalize audio, suppress ambient noise, and transcribe speech to script with millisecond precision.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <h3 className="step-heading">Download Subtitles &amp; Text Script</h3>
            <p className="step-body">
              Review text in our synchronized viewer, search through dialogue, and export your video script as TXT, SRT subtitles, VTT, or JSON.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Why VidScript: Feature Grid ─────────────────────────────── */}
      <section className="seo-section" aria-labelledby="features-heading">
        <div className="seo-section-header">
          <span className="section-eyebrow">AI TRANSCRIPTION CAPABILITIES</span>
          <h2 id="features-heading" className="seo-section-title">
            Why Creators Choose VidScript for Video to Text Conversion
          </h2>
        </div>

        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon" aria-hidden="true">🔗</div>
            <h3 className="feature-title">Instant Link to Script</h3>
            <p className="feature-text">
              No need to download videos to your device first. Paste any public video link to convert video to script directly in your browser.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" aria-hidden="true">🎯</div>
            <h3 className="feature-title">Sub-Second Timestamps</h3>
            <p className="feature-text">
              Every sentence segment is synchronized with millisecond start and end times, making it easy to create video captions and video chapters.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" aria-hidden="true">🌐</div>
            <h3 className="feature-title">90+ Spoken Languages</h3>
            <p className="feature-text">
              Convert video to text across English, Hindi, Spanish, French, German, Arabic, Japanese, Chinese, and dozens of regional languages automatically.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon" aria-hidden="true">🔒</div>
            <h3 className="feature-title">Strict Data Privacy</h3>
            <p className="feature-text">
              GDPR &amp; DPDP Act compliant. Zero permanent storage of uploaded media, zero training on user audio, and automatic ephemeral cleanup.
            </p>
          </div>
        </div>
      </section>

      {/* ─── SEO FAQ Accordion ────────────────────────────────────────── */}
      <section className="seo-section" aria-labelledby="faq-heading">
        <div className="seo-section-header">
          <span className="section-eyebrow">FREQUENTLY ASKED QUESTIONS</span>
          <h2 id="faq-heading" className="seo-section-title">
            Frequently Asked Questions About Video to Script &amp; Video to Text
          </h2>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
              <button
                type="button"
                className="faq-question-btn"
                onClick={() => toggleFaq(i)}
                aria-expanded={openFaq === i}
              >
                <span>{faq.q}</span>
                <span className="faq-icon" aria-hidden="true">{openFaq === i ? "−" : "+"}</span>
              </button>
              {openFaq === i && (
                <div className="faq-answer-panel">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
