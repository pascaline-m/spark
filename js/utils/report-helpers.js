// utils/report-helpers.js
import { state } from "../state/state.js";
import { EXAMPLE_CR_TITLE } from "../config/constants.js";

/**
 * Toggles the collapsed state of a report block
 * @param {HTMLElement} block - The block element
 * @param {boolean} openIfClosedOnly - Only open if closed, don't toggle
 */
export function toggleBlock(block, openIfClosedOnly = false) {
  const isOpen = !block.classList.contains("collapsed");
  if (openIfClosedOnly && isOpen) return;
  block.classList.toggle("collapsed");
}

/**
 * Deletes a report block by its element
 * @param {HTMLElement} block - The block element to delete
 */
export function deleteBlockByEl(block) {
  const id = block.dataset.id;
  const idx = state.crHistory.findIndex((d, i) => String(d.id ?? i) === id);
  if (idx >= 0) state.crHistory.splice(idx, 1);
  block.remove();
}

/**
 * Collapses all report blocks
 */
export function collapseAllBlocks() {
  document
    .querySelectorAll(".cr-block")
    .forEach((b) => b.classList.add("collapsed"));
}

/**
 * Gets the next test index for new reports
 * @returns {number} Next index number
 */
export function nextTestIndex() {
  return state.crHistory.filter((d) => !d.isExample).length + 1;
}

/**
 * Generates title for a document
 * @param {Object} doc - The document object
 * @param {number} idx - Index in the history
 * @returns {string} Document title
 */
export function titleForDoc(doc, idx) {
  if (doc.isExample) return EXAMPLE_CR_TITLE;
  const nonExampleList = state.crHistory.filter((d) => !d.isExample);
  const pos = Math.max(1, nonExampleList.indexOf(doc) + 1);
  return `Titre ${pos}`;
}
