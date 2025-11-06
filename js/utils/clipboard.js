// utils/clipboard.js
import { UI_TEXT } from "../config/constants.js";

/**
 * Copies text to clipboard with user feedback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert(UI_TEXT.MESSAGES.COPY_SUCCESS);
    return true;
  } catch (error) {
    alert(UI_TEXT.MESSAGES.COPY_ERROR);
    console.error("Clipboard copy failed:", error);
    return false;
  }
}

/**
 * Shows a user feedback message
 * @param {string} message - Message to display
 * @param {string} type - Message type (info, success, error)
 */
export function showFeedback(message, type = "info") {
  // TODO: Implement a better notification system
  alert(message);
}
