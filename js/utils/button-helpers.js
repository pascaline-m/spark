// utils/button-helpers.js
import { create } from "./dom.js";
import { SVG } from "./svg-icons.js";
import { copyToClipboard } from "./clipboard.js";
import { UI_TEXT } from "../config/constants.js";

/**
 * Creates a copy button with tooltip
 * @param {string} content - Content to copy
 * @param {string} tooltip - Tooltip text
 * @returns {HTMLElement} Button element
 */
export function createCopyButton(content, tooltip = "Copier") {
  const btn = create("button", "btn btn-icon fs12 p-micro");
  btn.dataset.tooltip = tooltip;
  btn.appendChild(SVG("copy", { size: 18 }));
  btn.onclick = async () => {
    await copyToClipboard(content);
  };
  return btn;
}

/**
 * Creates a feedback button (thumbs up)
 * @param {Function} onFeedback - Callback when button is clicked
 * @param {string} tooltip - Tooltip text
 * @returns {HTMLElement} Button element
 */
export function createFeedbackButton(onFeedback, tooltip = "Bon") {
  const btn = create("button", "btn btn-icon btn-feedback-positive fs12 p-micro");
  btn.dataset.tooltip = tooltip;
  btn.appendChild(SVG("thumbs-up", { size: 18 }));
  btn.onclick = () => {
    alert(UI_TEXT.MESSAGES.FEEDBACK_POSITIVE);
    onFeedback?.("positive");
  };
  return btn;
}

/**
 * Creates a negative feedback button (thumbs down)
 * @param {Function} onFeedback - Callback when button is clicked
 * @param {string} tooltip - Tooltip text
 * @returns {HTMLElement} Button element
 */
export function createNegativeFeedbackButton(onFeedback, tooltip = "À améliorer") {
  const btn = create("button", "btn btn-icon btn-feedback-negative fs12 p-micro");
  btn.dataset.tooltip = tooltip;
  btn.appendChild(SVG("thumbs-down", { size: 18 }));
  btn.onclick = () => {
    alert(UI_TEXT.MESSAGES.FEEDBACK_NEGATIVE);
    onFeedback?.("negative");
  };
  return btn;
}

/**
 * Creates an icon button with tooltip
 * @param {string} iconName - Name of the icon
 * @param {Function} onClick - Click handler
 * @param {string} tooltip - Tooltip text
 * @param {number} size - Icon size
 * @returns {HTMLElement} Button element
 */
export function createIconButton(iconName, onClick, tooltip = "", size = 18) {
  const btn = create("button", "btn btn-icon fs12 p-micro");
  if (tooltip) btn.dataset.tooltip = tooltip;
  btn.appendChild(SVG(iconName, { size }));
  btn.onclick = onClick;
  return btn;
}

/**
 * Creates a move up button
 * @param {Function} onMove - Callback when button is clicked
 * @returns {HTMLElement} Button element
 */
export function createMoveUpButton(onMove) {
  return createIconButton("chevron-up", onMove, "Monter", 18);
}

/**
 * Creates a move down button
 * @param {Function} onMove - Callback when button is clicked
 * @returns {HTMLElement} Button element
 */
export function createMoveDownButton(onMove) {
  return createIconButton("chevron-down", onMove, "Descendre", 18);
}
