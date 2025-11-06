// features/dictation.js
import { escapeHtml } from "../utils/dom.js";
import { state } from "../state/state.js";

export function renderDictatedContent(doc) {
  if (!state.verifyMode) return escapeHtml(doc.content);
  return doc.content
    .split(/(\s+)/)
    .map((w) => {
      const wl = w.toLowerCase();
      const isDict = doc.dictated?.some((ph) =>
        ph
          .toLowerCase()
          .split(/\s+/)
          .some((pw) => wl.includes(pw))
      );
      return isDict
        ? `<span style="background-color: #CCFFCC;">${escapeHtml(w)}</span>`
        : escapeHtml(w);
    })
    .join("");
}
