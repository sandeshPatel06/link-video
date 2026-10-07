import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { uploadFile, createJob } from "../api/client";

const LANGUAGES = [
  { code: "auto", name: "⚡ Auto-Detect Language" },
  { code: "en", name: "English (US / UK / International)" },
  { code: "hi", name: "Hindi (हिन्दी)" },
  { code: "es", name: "Spanish (Español)" },
  { code: "fr", name: "French (Français)" },
  { code: "de", name: "German (Deutsch)" },
  { code: "it", name: "Italian (Italiano)" },
  { code: "pt", name: "Portuguese (Português)" },
  { code: "ru", name: "Russian (Русский)" },
  { code: "ja", name: "Japanese (日本語)" },
  { code: "zh", name: "Chinese (中文)" },
  { code: "ko", name: "Korean (한국어)" },
  { code: "ar", name: "Arabic (العربية)" },
  { code: "ur", name: "Urdu (اردو)" },
  { code: "bn", name: "Bengali (বাংলা)" },
  { code: "mr", name: "Marathi (मराठी)" },
  { code: "ta", name: "Tamil (தமிழ்)" },
  { code: "te", name: "Telugu (తెలుగు)" },
  { code: "gu", name: "Gujarati (ગુજરાતી)" },
  { code: "kn", name: "Kannada (ಕನ್ನಡ)" },
  { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "id", name: "Indonesian (Bahasa Indonesia)" },
  { code: "tr", name: "Turkish (Türkçe)" },
  { code: "vi", name: "Vietnamese (Tiếng Việt)" },
  { code: "th", name: "Thai (ไทย)" },
  { code: "nl", name: "Dutch (Nederlands)" },
  { code: "pl", name: "Polish (Polski)" },
  { code: "sv", name: "Swedish (Svenska)" },
];

function fmtFileSize(bytes) {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export default function DropZone({ onJobCreated }) {
  const [tab, setTab] = useState("url"); // 'url' | 'file'
  const [url, setUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadPct, setUploadPct] = useState(0);
  const [lang, setLang] = useState("auto");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      // clipboard access denied, ignore
    }
  }

  function handleFileSelected(file) {
    if (!file) return;
    setError("");
    setSelectedFile(file);
  }

  async function handleStartTranscription() {
    if (!agreed) {
      setError("Please check the consent checkbox to verify terms and media rights before proceeding.");
      return;
    }
    setError("");

    if (tab === "url") {
      if (!url.trim()) {
        setError("Please enter a valid video or audio URL.");
        return;
      }
      setUploading(true);
      try {
        const { job_id } = await createJob(url.trim(), lang === "auto" ? null : lang);
        onJobCreated(job_id, url.trim());
      } catch (e) {
        setError(e?.response?.data?.detail || e.message || "Failed to start transcription job.");
      } finally {
        setUploading(false);
      }
    } else {
      if (!selectedFile) {
        setError("Please select or drop a media file to upload.");
        return;
      }
      setUploading(true);
      setUploadPct(0);
      try {
        const uploaded = await uploadFile(selectedFile, setUploadPct);
        const { job_id } = await createJob(uploaded.file_path, lang === "auto" ? null : lang);
        onJobCreated(job_id, uploaded.filename);
      } catch (e) {
        setError(e?.response?.data?.detail || e.message || "Upload failed. Please check network connection.");
      } finally {
        setUploading(false);
      }
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelected(file);
  }

  return (
    <div className="dropzone-card-container">
      {/* Mode Segmented Tab Control */}
      <div className="segmented-control" role="tablist" aria-label="Input Method">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "url"}
          className={`segment-btn ${tab === "url" ? "active" : ""}`}
          onClick={() => { setTab("url"); setError(""); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          Video Link to Script
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={tab === "file"}
          className={`segment-btn ${tab === "file" ? "active" : ""}`}
          onClick={() => { setTab("file"); setError(""); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Upload Video / Audio
        </button>
      </div>

      {/* URL Tab Content */}
      {tab === "url" && (
        <div className="tab-pane">
          <div className="input-group">
            <label htmlFor="url-input" className="field-label">Video Link to Script (YouTube, Vimeo, etc.)</label>
            <div className="input-field-wrapper">
              <span className="input-prefix-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </span>
              <input
                id="url-input"
                className="text-input-field"
                type="url"
                placeholder="Paste YouTube URL, Vimeo, Twitter/X, or Video Link to Script…"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleStartTranscription()}
                disabled={uploading}
                aria-label="Video or audio URL input to convert to script"
              />
              {url ? (
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setUrl("")}
                  title="Clear input"
                  aria-label="Clear URL"
                >
                  ✕
                </button>
              ) : (
                <button
                  type="button"
                  className="input-action-btn paste-btn"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  aria-label="Paste URL from clipboard"
                >
                  Paste
                </button>
              )}
            </div>
            <div className="supported-badges">
              <span className="format-chip">YouTube</span>
              <span className="format-chip">Vimeo</span>
              <span className="format-chip">Twitter / X</span>
              <span className="format-chip">Twitch</span>
              <span className="format-chip">Direct Audio/Video</span>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Tab Content */}
      {tab === "file" && (
        <div className="tab-pane">
          {!selectedFile ? (
            <div
              id="drop-zone"
              className={`drop-zone ${dragging ? "dragging" : ""} ${uploading ? "disabled" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => !uploading && fileRef.current?.click()}
              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && fileRef.current?.click()}
              tabIndex={0}
              role="button"
              aria-label="Upload file area: click or drop media file"
            >
              <input
                ref={fileRef}
                type="file"
                hidden
                accept="video/*,audio/*"
                onChange={(e) => handleFileSelected(e.target.files[0])}
              />
              <div className="drop-icon-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="drop-heading">Select file or drag &amp; drop</p>
              <p className="drop-hint">MP4, MOV, MKV, WebM, MP3, WAV, M4A, FLAC up to 2GB</p>
            </div>
          ) : (
            <div className="selected-file-card">
              <div className="file-info-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="23 7 16 12 23 17 23 7"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div className="file-info-text">
                <p className="file-name" title={selectedFile.name}>{selectedFile.name}</p>
                <p className="file-size">{fmtFileSize(selectedFile.size)}</p>
              </div>
              {!uploading && (
                <button
                  type="button"
                  className="file-remove-btn"
                  onClick={() => setSelectedFile(null)}
                  title="Remove file"
                  aria-label="Remove selected file"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {uploading && (
            <div className="upload-progress-box">
              <div className="progress-labels">
                <span className="upload-status-text">Uploading to secure processing server...</span>
                <span className="upload-percent-text">{uploadPct}%</span>
              </div>
              <div className="upload-bar-track">
                <div className="upload-bar" style={{ width: `${uploadPct}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Audio Language Selection */}
      <div className="settings-row">
        <label htmlFor="lang-select" className="settings-label">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
            <path d="M2 12h20"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          Audio Spoken Language
        </label>
        <div className="select-wrapper">
          <select
            id="lang-select"
            className="custom-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            disabled={uploading}
            aria-label="Select spoken language for transcription"
          >
            {LANGUAGES.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Form Consent Checkbox */}
      <div className="consent-row">
        <input
          type="checkbox"
          id="consent-check"
          className="custom-checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          aria-required="true"
        />
        <label htmlFor="consent-check" className="consent-text">
          I confirm that I possess copyright rights or authorization for this media, and agree to the{" "}
          <Link to="/terms" className="legal-link" target="_blank">Terms of Service</Link>{" "}
          and{" "}
          <Link to="/privacy" className="legal-link" target="_blank">Privacy Policy</Link>.
        </label>
      </div>

      {/* Error message */}
      {error && (
        <div className="error-alert" role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Main Submit Action Button */}
      <button
        type="button"
        id="transcribe-btn"
        className="btn-transcribe-main"
        onClick={handleStartTranscription}
        disabled={uploading || (tab === "url" ? !url.trim() : !selectedFile)}
        aria-label="Convert video to script"
      >
        {uploading ? (
          <>
            <span className="spinner" aria-hidden="true" />
            <span>Converting Video to Script...</span>
          </>
        ) : (
          <>
            <span>Convert Video to Script</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
