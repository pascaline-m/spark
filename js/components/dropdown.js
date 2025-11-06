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
  const root = create("div", `dd relative ${extraClass}`);
  const display = create("div", "dd-display", defaultLabel);
  const menu = create("div", "menu-dropdown");

  options.forEach((opt) => {
    const item = create("div", "menu-item", opt);
    item.onclick = (e) => {
      e.stopPropagation();
      display.textContent = opt;
      menu.classList.add("d-none");
      onSelect?.(opt);
    };
    menu.append(item);
  });

  display.onclick = (e) => {
    e.stopPropagation();
    // Close all other dropdowns
    document
      .querySelectorAll(".menu-dropdown")
      .forEach((m) => m.classList.add("d-none"));
    menu.classList.toggle("d-none");
  };

  root.append(display, menu);

  return {
    root,
    display,
    menu,
    setLabel: (s) => (display.textContent = s),
    getValue: () => display.textContent,
    hide: () => menu.classList.add("d-none"),
    show: () => menu.classList.remove("d-none"),
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
      .forEach((m) => m.classList.add("d-none"));
  });
}
