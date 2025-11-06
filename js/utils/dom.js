// utils/dom.js

/**
 * Shorthand for document.querySelector
 * @param {string} selector - CSS selector
 * @returns {Element|null} The first matching element or null
 */
export const el = (selector) => document.querySelector(selector);

/**
 * Creates a DOM element with optional class and content
 * @param {string} tag - HTML tag name
 * @param {string} className - CSS class names (space-separated)
 * @param {string} html - Inner HTML content
 * @returns {HTMLElement} The created element
 */
export function create(tag, className = "", html = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (html) element.innerHTML = html;
  return element;
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
export const escapeHtml = (str) =>
  str.replace(
    /[&<>"']/g,
    (match) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      }[match])
  );

/**
 * Creates a text node
 * @param {string} text - Text content
 * @returns {Text} Text node
 */
export function textNode(text) {
  return document.createTextNode(text);
}
