// views/tabs.js
import { state } from "../state/state.js";

export function renderTabs() {
  document
    .querySelectorAll(".tabs .tab")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.tab === state.activeTab)
    );
}
