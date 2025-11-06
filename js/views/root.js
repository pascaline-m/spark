// views/root.js
import { el } from "../utils/dom.js";
import { state } from "../state/state.js";
import { renderTabs } from "./tabs.js";
import { renderVoiceDictTab } from "./voice.js";
import { renderReportTab } from "./report.js";
import { renderLetterTab } from "./letter.js";
import { renderSettings } from "./settings.js";

export function render() {
  if (state.showSettings) {
    el("#mainView").classList.add("hidden");
    el("#settingsView").classList.remove("hidden");
    renderSettings();
  } else {
    el("#settingsView").classList.add("hidden");
    el("#mainView").classList.remove("hidden");
    renderTabs();
    renderTabContent();
  }
}

function renderTabContent() {
  const root = el("#tabContent");
  root.innerHTML = "";
  if (state.activeTab === "voice") root.append(renderVoiceDictTab());
  else if (state.activeTab === "cr") root.append(renderReportTab());
  else root.append(renderLetterTab());
}
