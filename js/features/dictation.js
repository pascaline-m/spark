// features/dictation.js
import { escapeHtml } from "../utils/dom.js";
import { state } from "../state/state.js";

/**
 * Renders dictated content with optional highlighting in verify mode
 * @param {Object} doc - Document object containing content and dictated phrases
 * @param {string} doc.content - The document content
 * @param {string[]} [doc.dictated] - Array of dictated phrases to highlight
 * @returns {string} HTML string with content (escaped or highlighted)
 */
export function renderDictatedContent(doc) {
  if (!doc || !doc.content) {
    console.warn("renderDictatedContent called with invalid doc:", doc);
    return "";
  }

  // If not in verify mode, just escape and return the content
  if (!state.verifyMode) {
    return escapeHtml(doc.content);
  }

  // In verify mode, highlight dictated phrases
  if (!Array.isArray(doc.dictated) || doc.dictated.length === 0) {
    return escapeHtml(doc.content);
  }

  return doc.content
    .split(/(\s+)/)
    .map((word) => {
      const wordLower = word.toLowerCase();
      const isDictated = doc.dictated.some((phrase) =>
        phrase
          .toLowerCase()
          .split(/\s+/)
          .some((phraseWord) => wordLower.includes(phraseWord))
      );
      
      return isDictated
        ? '<span style="background-color: #CCFFCC;">' + escapeHtml(word) + '</span>'
        : escapeHtml(word);
    })
    .join("");
}
