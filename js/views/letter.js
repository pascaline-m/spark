// views/letter.js
import { create } from "../utils/dom.js";
import { state } from "../state/state.js";
import { SVG } from "../utils/svg-icons.js";
import { nowTime } from "../utils/time.js";

/**
 * Renders the letter tab view
 * @returns {HTMLElement} The letter tab container
 */
export function renderLetterTab() {
  const wrap = create("div", "main-container");
  const content = create("div", "content p12");

  // Header section
  const header = create("div", "mb16");
  const title = create("h2", "fs16 bold mb8", "Rédaction de courrier");
  const subtitle = create(
    "p",
    "fs12 muted",
    "Générez un courrier médical à partir d'un compte rendu"
  );
  header.append(title, subtitle);

  // Letter type selection
  const typeSection = create("div", "mb16");
  const typeLabel = create("label", "fs12 bold mb6", "Type de destinataire");
  typeLabel.style.display = "block";

  const typeSelect = create("select", "select w100 p8");
  typeSelect.innerHTML = `
    <option value="confrere" ${state.letterRecipient === "confrere" ? "selected" : ""}>Confrère</option>
    <option value="patient" ${state.letterRecipient === "patient" ? "selected" : ""}>Patient</option>
  `;
  typeSelect.onchange = (e) => {
    state.letterRecipient = e.target.value;
  };
  typeSection.append(typeLabel, typeSelect);

  // Source CR selection if available
  const sourceSection = create("div", "mb16");
  if (state.selectedCrForLetter) {
    const sourceLabel = create("label", "fs12 bold mb6", "Basé sur le compte rendu");
    sourceLabel.style.display = "block";
    const sourceInfo = create(
      "div",
      "p8 fs12",
      `${state.selectedCrForLetter.title || "Compte rendu"} - ${state.selectedCrForLetter.time || nowTime()}`
    );
    sourceInfo.style.background = "#f9f9f9";
    sourceInfo.style.border = "1px solid #e0e0e0";
    sourceInfo.style.borderRadius = "3px";
    sourceSection.append(sourceLabel, sourceInfo);
  }

  // Letter input area
  const inputSection = create("div", "mb16");
  const inputLabel = create("label", "fs12 bold mb6", "Instructions supplémentaires");
  inputLabel.style.display = "block";

  const textarea = create("textarea", "textarea fs14");
  textarea.placeholder = "Ajoutez des instructions pour personnaliser le courrier...";
  textarea.value = state.letterInput || "";
  textarea.style.minHeight = "120px";
  textarea.oninput = (e) => {
    state.letterInput = e.target.value;
  };
  inputSection.append(inputLabel, textarea);

  // Actions
  const actions = create("div", "flex-between");
  const leftActions = create("div", "flex gap8");

  const micBtn = create("button", "btn btn-icon fs12");
  micBtn.appendChild(SVG("mic", { size: 18 }));
  micBtn.dataset.tooltip = "Dicter";
  micBtn.onclick = () => textarea.focus();

  leftActions.append(micBtn);

  const rightActions = create("div", "flex gap8");

  const generateBtn = create("button", "btn fs12", "Générer le courrier");
  generateBtn.onclick = () => {
    // TODO: Implement letter generation
    const newLetter = {
      id: Date.now(),
      time: nowTime(),
      recipient: state.letterRecipient,
      sourceCrId: state.selectedCrForLetter?.id,
      instructions: state.letterInput,
      content: generateLetterContent(),
    };

    if (!Array.isArray(state.letterHistory)) {
      state.letterHistory = [];
    }
    state.letterHistory.push(newLetter);
    state.letterInput = "";
    alert("Courrier généré avec succès !");
  };

  rightActions.append(generateBtn);
  actions.append(leftActions, rightActions);

  // Letter history
  const historySection = create("div", "mt16");
  if (Array.isArray(state.letterHistory) && state.letterHistory.length > 0) {
    const historyTitle = create("h3", "fs14 bold mb8", "Historique des courriers");
    historySection.append(historyTitle);

    state.letterHistory.forEach((letter) => {
      const letterBlock = create("div", "p12 mb8");
      letterBlock.style.background = "#f9f9f9";
      letterBlock.style.border = "1px solid #e0e0e0";
      letterBlock.style.borderRadius = "3px";

      const letterHeader = create("div", "flex-between mb8");
      const letterInfo = create(
        "span",
        "fs12 bold",
        `${letter.recipient === "confrere" ? "Confrère" : "Patient"} - ${letter.time}`
      );

      const copyBtn = create("button", "btn btn-icon fs12");
      copyBtn.appendChild(SVG("copy", { size: 16 }));
      copyBtn.onclick = async () => {
        try {
          await navigator.clipboard.writeText(letter.content);
          alert("✓ Copié !");
        } catch {
          alert("Impossible de copier");
        }
      };

      letterHeader.append(letterInfo, copyBtn);

      const letterContent = create("div", "fs12", letter.content);
      letterBlock.append(letterHeader, letterContent);
      historySection.append(letterBlock);
    });
  }

  content.append(header, typeSection, sourceSection, inputSection, actions, historySection);
  wrap.append(content);

  return wrap;
}

/**
 * Generates placeholder letter content
 * @returns {string} Generated letter content
 */
function generateLetterContent() {
  const recipient = state.letterRecipient === "confrere" ? "Cher confrère" : "Cher patient";
  const intro = state.letterRecipient === "confrere"
    ? "Je vous adresse ce courrier concernant l'examen réalisé."
    : "Suite à votre examen, je vous écris pour vous informer des résultats.";

  return `${recipient},\n\n${intro}\n\n${state.letterInput || ""}\n\nCordialement,`;
}
