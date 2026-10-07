function fmtSrtTime(s) {
  const h = Math.floor(s / 3600).toString().padStart(2, "0");
  const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
  const sec = Math.floor(s % 60).toString().padStart(2, "0");
  const ms = Math.round((s % 1) * 1000).toString().padStart(3, "0");
  return `${h}:${m}:${sec},${ms}`;
}

function fmtVttTime(s) {
  return fmtSrtTime(s).replace(",", ".");
}

function buildTxt(segments) {
  return segments.map((s) => s.text.trim()).join("\n");
}

function buildJson(transcript) {
  return JSON.stringify(transcript, null, 2);
}

function buildSrt(segments) {
  return segments
    .map((seg, i) =>
      `${i + 1}\n${fmtSrtTime(seg.start)} --> ${fmtSrtTime(seg.end)}\n${seg.text.trim()}\n`
    )
    .join("\n");
}

function buildVtt(segments) {
  const body = segments
    .map((seg) => `${fmtVttTime(seg.start)} --> ${fmtVttTime(seg.end)}\n${seg.text.trim()}`)
    .join("\n\n");
  return `WEBVTT\n\n${body}\n`;
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const FORMATS = [
  {
    fmt: "txt",
    label: "Plain Text",
    ext: ".TXT",
    desc: "Readable copy with line breaks",
    type: "text/plain",
    build: (t) => buildTxt(t.segments),
  },
  {
    fmt: "srt",
    label: "Subtitles",
    ext: ".SRT",
    desc: "Standard YouTube & Premiere subtitles",
    type: "text/plain",
    build: (t) => buildSrt(t.segments),
  },
  {
    fmt: "vtt",
    label: "Web Subtitles",
    ext: ".VTT",
    desc: "HTML5 video player subtitles",
    type: "text/vtt",
    build: (t) => buildVtt(t.segments),
  },
  {
    fmt: "json",
    label: "Structured Data",
    ext: ".JSON",
    desc: "Full segment array with millisecond timestamps",
    type: "application/json",
    build: (t) => buildJson(t),
  },
];

export default function DownloadButtons({ transcript }) {
  function handleDownload(format) {
    const content = format.build(transcript);
    downloadBlob(content, `transcript.${format.fmt}`, format.type);
  }

  return (
    <div className="download-container">
      <div className="download-header-row">
        <h3 className="download-section-title">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export &amp; Download Formats
        </h3>
        <span className="download-badge">No Watermark · Instant Blob</span>
      </div>

      <div className="download-card-grid">
        {FORMATS.map((f) => (
          <button
            key={f.fmt}
            type="button"
            className="export-card"
            onClick={() => handleDownload(f)}
            title={`Download as ${f.label} (${f.ext})`}
            aria-label={`Download transcript as ${f.label}`}
          >
            <div className="export-top">
              <span className="export-ext-badge">{f.ext}</span>
              <svg className="export-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17l9.2-9.2M17 17V8H8"/>
              </svg>
            </div>
            <p className="export-title">{f.label}</p>
            <p className="export-desc">{f.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
