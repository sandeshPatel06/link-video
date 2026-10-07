import { useState, useEffect } from "react";
import DropZone from "../components/DropZone";
import ProgressTracker from "../components/ProgressTracker";
import TranscriptViewer from "../components/TranscriptViewer";
import DownloadButtons from "../components/DownloadButtons";
import AdSlot from "../components/AdSlot";
import SeoContent from "../components/SeoContent";
import { fetchResult } from "../api/client";
import { usePageMeta } from "../hooks/usePageMeta";

const PHASE = { INPUT: "input", PROCESSING: "processing", DONE: "done", ERROR: "error" };
const HISTORY_KEY = "lv_history";
const MAX_HISTORY = 12;

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]"); }
  catch { return []; }
}

function saveToHistory(entry) {
  const prev = loadHistory();
  const updated = [entry, ...prev.filter((h) => h.id !== entry.id)].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

function removeFromHistory(id) {
  const updated = loadHistory().filter((h) => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

function fmtDuration(s) {
  if (!s) return "0s";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
}

function fmtDate(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " · " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

function sourceLabel(src) {
  if (!src) return "Media stream";
  if (src.startsWith("http")) {
    try {
      const u = new URL(src);
      return u.hostname.replace("www.", "") + (u.pathname.length > 1 ? u.pathname.slice(0, 20) + "…" : "");
    } catch { return src; }
  }
  return src.length > 50 ? src.slice(0, 47) + "…" : src;
}

export default function Home() {
  usePageMeta(
    "VidScript — Free Video to Script & Video to Text AI Converter | Link to Script",
    "Convert any video link to script, video to text, or audio to text with timestamps in seconds. Free AI speech-to-text. Export to SRT, VTT, TXT, and JSON."
  );

  const [phase, setPhase] = useState(PHASE.INPUT);
  const [jobId, setJobId] = useState(null);
  const [source, setSource] = useState("");
  const [transcript, setTranscript] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  async function handleJobCreated(id, src) {
    setJobId(id);
    setSource(src);
    setPhase(PHASE.PROCESSING);
  }

  async function handleDone() {
    try {
      const data = await fetchResult(jobId);
      setTranscript(data);
      setPhase(PHASE.DONE);

      // Save to localStorage history
      const entry = {
        id: jobId,
        source,
        timestamp: Date.now(),
        language: data.language,
        duration: data.duration,
        segments: data.segments,
      };
      saveToHistory(entry);
      setHistory(loadHistory());
    } catch {
      setErrorMsg("Transcription succeeded on server, but results could not be fetched. Please try again.");
      setPhase(PHASE.ERROR);
    }
  }

  function handleError(msg) {
    setErrorMsg(msg || "An unexpected error occurred during transcription.");
    setPhase(PHASE.ERROR);
  }

  function reset() {
    setPhase(PHASE.INPUT);
    setJobId(null);
    setSource("");
    setTranscript(null);
    setErrorMsg("");
  }

  function loadFromHistory(entry) {
    setTranscript({
      source: entry.source,
      language: entry.language,
      duration: entry.duration,
      segments: entry.segments,
    });
    setSource(entry.source);
    setPhase(PHASE.DONE);
  }

  function deleteHistory(e, id) {
    e.stopPropagation();
    removeFromHistory(id);
    setHistory(loadHistory());
  }

  return (
    <div className="page">
      <main className="main-content">
        {/* Modern SaaS Hero - Keyword Optimized */}
        <div className="hero-section">
          <div className="hero-announcement-chip">
            <span className="chip-spark">✨</span>
            <span className="chip-text">#1 Free Video to Script &amp; Video to Text AI</span>
          </div>

          <h1 className="hero-headline">
            Video to Script &amp; <span className="text-gradient">Video to Text</span>
          </h1>

          <p className="hero-description">
            Paste any video link to script or upload media files. Convert YouTube URLs, MP4s, podcasts, and recordings into accurate timestamped scripts and subtitles in seconds.
          </p>

          <div className="hero-feature-tags">
            <div className="feature-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Link to Script in 1-Click</span>
            </div>
            <div className="feature-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>99% Video to Text Accuracy</span>
            </div>
            <div className="feature-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>Export SRT, VTT &amp; TXT</span>
            </div>
            <div className="feature-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>90+ Spoken Languages</span>
            </div>
          </div>
        </div>

        {/* Primary Interactive App Card */}
        <div className="app-main-card">
          {phase === PHASE.INPUT && (
            <DropZone onJobCreated={handleJobCreated} />
          )}

          {phase === PHASE.PROCESSING && (
            <div className="processing-wrapper">
              <div className="source-banner">
                <span className="source-label-pill">PROCESSING SOURCE</span>
                <span className="source-val-text" title={source}>{sourceLabel(source)}</span>
              </div>
              <ProgressTracker
                jobId={jobId}
                onDone={handleDone}
                onError={handleError}
              />
            </div>
          )}

          {phase === PHASE.DONE && transcript && (
            <div className="results-wrapper">
              {/* Success Result Top Banner */}
              <div className="results-banner">
                <div className="results-banner-left">
                  <div className="success-icon-badge" aria-hidden="true">✓</div>
                  <div>
                    <h2 className="results-heading">Transcription Completed</h2>
                    <p className="results-source-meta">{sourceLabel(source)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-new-transcription"
                  onClick={reset}
                  aria-label="Start a new transcription"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  New Transcription
                </button>
              </div>

              {/* Downloads Bar */}
              <DownloadButtons transcript={transcript} />

              {/* Interactive Viewer */}
              <TranscriptViewer
                segments={transcript.segments}
                language={transcript.language}
                duration={transcript.duration}
              />
            </div>
          )}

          {phase === PHASE.ERROR && (
            <div className="error-card-state">
              <div className="error-icon-circle">✕</div>
              <h2 className="error-heading">Processing Encountered an Issue</h2>
              <p className="error-description-text">{errorMsg}</p>
              <button type="button" className="btn-primary" onClick={reset}>
                Try Another File or Link
              </button>
            </div>
          )}
        </div>

        {/* Compliant Google Ads Unit Slot */}
        <AdSlot slotId="transcription-banner-1" format="horizontal" />

        {/* Recent Session History (stored in browser) */}
        {phase === PHASE.INPUT && history.length > 0 && (
          <div className="recent-history-section">
            <div className="history-title-row">
              <div className="history-title-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <h3 className="history-heading">Recent Browser History</h3>
                <span className="history-count-badge">{history.length}</span>
              </div>
              <button
                type="button"
                className="btn-clear-history"
                onClick={() => { localStorage.removeItem(HISTORY_KEY); setHistory([]); }}
                aria-label="Clear all recent history"
              >
                Clear all
              </button>
            </div>

            <div className="history-grid-cards">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="history-item-card"
                  onClick={() => loadFromHistory(entry)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && loadFromHistory(entry)}
                  aria-label={`Open transcript for ${sourceLabel(entry.source)}`}
                >
                  <div className="history-item-top">
                    <span className="history-lang-tag">{entry.language?.toUpperCase() || "EN"}</span>
                    <span className="history-time-tag">{fmtDuration(entry.duration)}</span>
                    <button
                      type="button"
                      className="history-delete-item"
                      onClick={(e) => deleteHistory(e, entry.id)}
                      title="Remove from history"
                      aria-label="Remove item from history"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="history-source-name">{sourceLabel(entry.source)}</p>
                  <p className="history-date-stamp">{fmtDate(entry.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Semantic SEO & FAQ Guide Section for Search Engines & Users */}
        <SeoContent />
      </main>
    </div>
  );
}
