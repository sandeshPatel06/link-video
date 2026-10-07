import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export async function uploadFile(file, onProgress) {
  const form = new FormData();
  form.append("file", file);
  const res = await api.post("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) onProgress(Math.round((e.loaded / e.total) * 100));
    },
  });
  return res.data;
}

export async function createJob(source, language = null) {
  const res = await api.post("/jobs", { source, language });
  return res.data;
}

export function streamJob(jobId, onEvent, onDone, onError) {
  const url = `${BASE_URL}/jobs/${jobId}/stream`;
  const es = new EventSource(url);
  es.onmessage = (e) => {
    try {
      const data = JSON.parse(e.data);
      onEvent(data);
      if (data.status === "done" || data.status === "error") {
        es.close();
        if (data.status === "done") onDone();
        else onError(data.message);
      }
    } catch {}
  };
  es.onerror = () => {
    es.close();
    onError("Connection lost. Please try again.");
  };
  return () => es.close();
}

export async function fetchResult(jobId) {
  const res = await api.get(`/jobs/${jobId}/result`);
  return res.data;
}
