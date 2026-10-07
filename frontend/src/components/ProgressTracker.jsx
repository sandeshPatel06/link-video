import { useEffect, useRef, useState } from "react";
import { streamJob } from "../api/client";

const STAGES = [
  { key: "validate", label: "Validate Input" },
  { key: "download", label: "Retrieve Media" },
  { key: "audio", label: "Audio Normalize" },
  { key: "transcribe", label: "Neural Transcription" },
  { key: "output", label: "Format Results" },
];

export default function ProgressTracker({ jobId, onDone, onError }) {
  const [currentStage, setCurrentStage] = useState("validate");
  const [progress, setProgress] = useState(5);
  const [logs, setLogs] = useState([]);
  const logElRef = useRef();

  useEffect(() => {
    if (!jobId) return;
    const unsub = streamJob(
      jobId,
      (event) => {
        setCurrentStage(event.stage);
        setProgress(event.progress);
        setLogs((prev) => [...prev, { text: event.message, status: event.status, time: new Date().toLocaleTimeString() }]);

        if (logElRef.current) {
          logElRef.current.scrollTop = logElRef.current.scrollHeight;
        }
      },
      () => onDone && onDone(),
      (msg) => onError && onError(msg)
    );
    return () => unsub && unsub();
  }, [jobId]);

  return (
    <div className="progress-card">
      <div className="progress-top-info">
        <div className="progress-spinner-title">
          <span className="live-pulse-spinner" aria-hidden="true"></span>
          <div>
            <p className="progress-status-heading">Processing Transcription</p>
            <p className="progress-status-sub">Speech recognition model is running audio inference</p>
          </div>
        </div>
        <div className="progress-numerical-pill">
          {progress}%
        </div>
      </div>

      {/* Progress Bar with Gradient */}
      <div className="progress-track-wrapper">
        <div
          className="progress-fill-bar"
          style={{ width: `${Math.max(5, progress)}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* Stepper Navigation */}
      <div className="stepper-row" aria-label="Pipeline steps">
        {STAGES.map((s, index) => {
          const currentIndex = STAGES.findIndex(st => st.key === currentStage);
          const isPassed = index < currentIndex;
          const isCurrent = s.key === currentStage;
          return (
            <div
              key={s.key}
              className={`step-item ${isCurrent ? "current" : isPassed ? "done" : "upcoming"}`}
            >
              <div className="step-circle">
                {isPassed ? "✓" : index + 1}
              </div>
              <span className="step-title">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Real-time Event Console Log */}
      <div className="console-log-box" ref={logElRef}>
        <div className="console-header">
          <span className="console-dot red"></span>
          <span className="console-dot yellow"></span>
          <span className="console-dot green"></span>
          <span className="console-title">Engine Output Stream</span>
        </div>
        <div className="console-lines">
          {logs.map((l, i) => (
            <div key={i} className={`console-line line-${l.status}`}>
              <span className="console-time">[{l.time}]</span>
              <span className="console-text">{l.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
