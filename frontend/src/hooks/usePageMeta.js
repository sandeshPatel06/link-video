import { useEffect } from "react";

export function usePageMeta(title, description) {
  useEffect(() => {
    if (title) {
      document.title = `${title} — VidScript`;
    }
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", description);
      }
    }
  }, [title, description]);
}
