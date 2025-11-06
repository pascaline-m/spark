// components/dropdown.js
import { create } from "../utils/dom.js";

/**
 * Creates a reusable dropdown component
 * @param {string} defaultLabel - The default label to display
 * @param {string[]} options - Array of option strings
 * @param {Function} onSelect - Callback function when an option is selected
 * @param {string} extraClass - Additional CSS classes
 * @returns {Object} Dropdown object with root element and methods
 */
export function makeDropdown(defaultLabel, options, onSelect, extraClass = "") {
  const root = create("div", `dd ${extraClass}`);
  root.style.position = "relative";

  const display = create("div", "dd-display", defaultLabel);
  const menu = create("div", "menu-dropdown");

  options.forEach((opt) => {
    const item = create("div", "menu-item", opt);
    item.onmouseenter = () => (item.style.background = "#f0f0f0");
    item.onmouseleave = () => (item.style.background = "transparent");
    item.onclick = (e) => {
      e.stopPropagation();
      display.textContent = opt;
      menu.style.display = "none";
      onSelect?.(opt);
    };
    menu.append(item);
  });

  display.onclick = (e) => {
    e.stopPropagation();
    // Close all other dropdowns
    document
      .querySelectorAll(".menu-dropdown")
      .forEach((m) => (m.style.display = "none"));
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  root.append(display, menu);

  return {
    root,
    display,
    menu,
    setLabel: (s) => (display.textContent = s),
    getValue: () => display.textContent,
    hide: () => (menu.style.display = "none"),
    show: () => (menu.style.display = "block"),
  };
}

/**
 * Initializes global click handler to close dropdowns when clicking outside
 * This should only be called once during app initialization
 */
let dropdownHandlerInstalled = false;

export function initDropdownGlobalHandler() {
  if (dropdownHandlerInstalled) return;
  dropdownHandlerInstalled = true;

  document.addEventListener("click", () => {
    document
      .querySelectorAll(".menu-dropdown")
      .forEach((m) => (m.style.display = "none"));
  });
}
