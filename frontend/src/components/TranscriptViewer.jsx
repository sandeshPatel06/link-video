import { useState, useMemo } from "react";

export default function TranscriptViewer({ segments, language, duration }) {
  const [showTimestamps, setShowTimestamps] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const fullText = useMemo(() => {
    return segments.map((s) => s.text).join(" ");
  }, [segments]);

  const wordCount = useMemo(() => {
    return fullText.trim().split(/\s+/).filter(Boolean).length;
  }, [fullText]);

  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 180));

  function fmtTime(s) {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = Math.floor(s % 60);
    return h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
      : `${m}:${String(sec).padStart(2, "0")}`;
  }

  async function copyAll() {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function copySegment(text, idx) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  // Filtered segments based on search
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    const q = searchQuery.toLowerCase();
    return segments.filter((seg) => seg.text.toLowerCase().includes(q));
  }, [segments, searchQuery]);

  return (
    <div className="transcript-viewer-card">
      {/* Top Toolbar */}
      <div className="transcript-header-bar">
        <div className="transcript-meta-chips">
          <span className="meta-chip">
            <span className="chip-label">LANG</span>
            <span className="chip-value">{language?.toUpperCase() || "EN"}</span>
          </span>
          <span className="meta-chip">
            <span className="chip-label">LENGTH</span>
            <span className="chip-value">{Math.round(duration)}s</span>
          </span>
          <span className="meta-chip">
            <span className="chip-label">WORDS</span>
            <span className="chip-value">{wordCount.toLocaleString()}</span>
          </span>
          <span className="meta-chip">
            <span className="chip-label">READ</span>
            <span className="chip-value">~{readingTimeMinutes} min</span>
          </span>
        </div>

        <div className="transcript-action-bar">
          <button
            type="button"
            className="btn-toolbar"
            onClick={() => setShowTimestamps(!showTimestamps)}
            aria-pressed={showTimestamps}
            title={showTimestamps ? "Hide timestamp columns" : "Show timestamp columns"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {showTimestamps ? "Hide Timestamps" : "Show Timestamps"}
          </button>

          <button
            type="button"
            className={`btn-toolbar ${copied ? "btn-copied" : ""}`}
            onClick={copyAll}
            title="Copy entire transcript text"
            aria-label="Copy transcript"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Real-time search filter */}
      <div className="transcript-search-bar">
        <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Filter or search in transcript text…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search within transcript"
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => setSearchQuery("")}
            title="Clear search"
            aria-label="Clear transcript search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Transcript Body List */}
      <div className="transcript-content-area" id="transcript-body">
        {filteredSegments.length === 0 ? (
          <div className="no-matches-box">
            <p>No segments found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredSegments.map((seg, i) => (
            <div key={i} className="segment-row">
              {showTimestamps && (
                <div className="segment-time-badge" title="Start and end time">
                  <span className="time-text">{fmtTime(seg.start)}</span>
                  <span className="time-sep">→</span>
                  <span className="time-text">{fmtTime(seg.end)}</span>
                </div>
              )}
              <p className="segment-content-text">{seg.text}</p>
              <button
                type="button"
                className="segment-copy-btn"
                onClick={() => copySegment(seg.text, i)}
                title="Copy this section"
                aria-label={`Copy section at ${fmtTime(seg.start)}`}
              >
                {copiedIndex === i ? "✓" : "Copy"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
