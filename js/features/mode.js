// features/mode.js
export function attachModeDropdownHandlers() {
  const iaModeBtn = document.getElementById("ia-mode-btn");
  const iaDropdown = document.getElementById("ia-dropdown");
  let selectedMode = "generique";
  iaModeBtn?.addEventListener("click", () => {
    iaDropdown.style.display =
      iaDropdown.style.display === "block" ? "none" : "block";
  });
  iaDropdown?.addEventListener("click", (e) => {
    const target = e.target.closest("div[data-mode]");
    if (!target) return;
    selectedMode = target.dataset.mode;
    iaModeBtn.querySelector(".icon").textContent =
      selectedMode === "generique"
        ? "🧠"
        : selectedMode === "specialise"
        ? "✨"
        : "🤖";
    iaDropdown.style.display = "none";
  });
}

export function updateModeDescription() {
  const select = document.querySelector(
    'select[onchange="updateModeDescription()"]'
  );
  const descDiv = document.getElementById("mode-desc");
  if (!select || !descDiv) return;
  const value = select.value;
  const descriptions = {
    spark:
      "<strong>Spark uniquement:</strong> Générez des comptes rendus structurés. Utilisez pour: Comptes rendus radiologiques.",
    universal:
      "<strong>Mode universel:</strong> Dictez dans n'importe quel formulaire du web. Utilisez pour: Emails, RIS, formulaires.",
    targeted:
      "<strong>Mode ciblé (RIS + Gmail):</strong> Dictée réservée aux domaines de confiance. Plus sécurisé.",
  };
  descDiv.innerHTML = descriptions[value] || descriptions.universal;
}

window.updateModeDescription = updateModeDescription;
