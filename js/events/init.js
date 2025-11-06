// events/init.js
import { state } from "../state/state.js";
import { render } from "../views/root.js";
import { attachModeDropdownHandlers } from "../features/mode.js";
import { initDropdownGlobalHandler } from "../components/dropdown.js";

/**
 * Initializes all event listeners for the application
 */
export function initEvents() {
  // Tab navigation handler
  document.addEventListener("click", (e) => {
    const t = e.target;
    if (t.classList.contains("tab") && t.dataset.tab) {
      state.activeTab = t.dataset.tab;
      render();
    }
    if (t.classList.contains("tab") && t.dataset.stab) {
      state.settingsTab = t.dataset.stab;
      render();
    }
  });

  // Initialize DOM-dependent event handlers
  const initDOMHandlers = () => {
    const openSettings = document.getElementById("openSettings");
    const closeSettings = document.getElementById("closeSettings");

    openSettings &&
      (openSettings.onclick = () => {
        state.showSettings = true;
        render();
      });

    closeSettings &&
      (closeSettings.onclick = () => {
        state.showSettings = false;
        render();
      });

    attachModeDropdownHandlers();
    initDropdownGlobalHandler();
    render();
  };

  // Check if DOM is already loaded (handles module defer behavior)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDOMHandlers);
  } else {
    // DOM is already ready, execute immediately
    initDOMHandlers();
  }
}

// Export render for internal use
export { render };
