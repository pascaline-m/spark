// utils/time.js

/**
 * Gets the current time formatted as HH:MM in French locale
 * @returns {string} Formatted time string (e.g., "14:30")
 */
export const nowTime = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
