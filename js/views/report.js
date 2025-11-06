// views/cr.js
import { create } from "../utils/dom.js";
import { state } from "../state/state.js";
import { nowTime } from "../utils/time.js";
import { SVG } from "../utils/svg-icons.js";
import { makeDropdown, initDropdownGlobalHandler } from "../components/dropdown.js";
import {
  createCopyButton,
  createFeedbackButton,
  createNegativeFeedbackButton,
  createIconButton
} from "../utils/button-helpers.js";

// Initialize global dropdown handler once
initDropdownGlobalHandler();

/* ------------------------------------------------------------------
   Utils multi‑blocs
------------------------------------------------------------------- */
function toggleBlock(block, openIfClosedOnly = false) {
  const isOpen = !block.classList.contains("collapsed");
  if (openIfClosedOnly && isOpen) return;
  block.classList.toggle("collapsed");
}

function deleteBlockByEl(block) {
  const id = block.dataset.id;
  const idx = state.crHistory.findIndex((d, i) => String(d.id ?? i) === id);
  if (idx >= 0) state.crHistory.splice(idx, 1);
  block.remove();
}

function collapseAllBlocks() {
  document
    .querySelectorAll(".cr-block")
    .forEach((b) => b.classList.add("collapsed"));
}

function nextTestIndex() {
  return state.crHistory.filter((d) => !d.isExample).length + 1;
}

/* ------------------------------------------------------------------
   Titre pour un doc (utilisé par le header d'un bloc)
------------------------------------------------------------------- */
function titleForDoc(doc, idx) {
  // L'existant du state.js est respecté : si le doc vient du state avec un title déjà "Réponse n", on l'affiche tel quel
  if (doc.isExample) return "RUPTURE LIGAMENT CROISÉ ANTÉRIEUR GENOU GAUCHE";
  const nonExampleList = state.crHistory.filter((d) => !d.isExample);
  const pos = Math.max(1, nonExampleList.indexOf(doc) + 1);

  // Si c'est un courrier, afficher "Courrier x", sinon "Compte-rendu x"
  if (doc.docType === "courrier") {
    return `Courrier ${pos}`;
  }
  return `Compte-rendu ${pos}`;
}

/* ------------------------------------------------------------------
   Rendu d'une carte additionnelle (correction ou courrier)
------------------------------------------------------------------- */
function makeAdditionalCard(card, doc, isLastResponse = false, actions = null) {
  const cardContainer = create("div", "cr-card mt16 border-top pt16");

  // Label de la carte
  const cardLabel = create("div", "cr-section-label mb8", "");
  if (card.type === "correction-request") {
    cardLabel.textContent = "Demande de correction";
  } else if (card.type === "correction-response") {
    cardLabel.textContent = "Version corrigée";
  } else if (card.type === "letter-request") {
    cardLabel.textContent = "Demande de courrier";
  } else if (card.type === "letter-response") {
    cardLabel.textContent = "Courrier généré";
  }

  // Contenu de la carte
  const cardContent = create("div", "cr-answer fs14 p12", card.content || "");

  // Header si c'est une réponse (correction ou courrier)
  if (card.type === "correction-response" || card.type === "letter-response") {
    const cardHeader = create("div", "doc-header mb8", "");

    // Ne pas afficher le badge IA pour les réponses de correction
    if (card.type === "letter-response") {
      let badgeLabel = card.letterRecipient === "patient" ? "IA Patient" : "IA Confrère";
      const badge = create("span", "badge-ia", badgeLabel);
      cardHeader.append(badge);
    }

    const rightGroup = create("div", "header-right");
    const timeSpan = create("span", " muted fs12", "(3s)");
    const hour = create("span", "btn-icon fs12", `${card.time || nowTime()}`);
    rightGroup.append(timeSpan, hour);
    cardHeader.append(rightGroup);

    cardContainer.append(cardLabel, cardHeader, cardContent);

    // Actions pour courrier généré (letter-response) - seulement si c'est la dernière réponse
    if (card.type === "letter-response" && isLastResponse) {
      const letterActions = create("div", "doc-actions mt12");
      const letterRow = create("div", "btn-row");

      const bCorr = create("button", "btn btn-corriger fs12");
      bCorr.dataset.tooltip = "Corriger le courrier";
      bCorr.append(SVG("edit", { size: 18 }), create("span", "", " Corriger"));
      bCorr.onclick = () => {
        state.correctionMode = true;
        state.correctionInput = "";
        state.activeCorrectionDocId = doc.id;
        window.render();
      };

      const spacer = create("div", "flex-1");
      const bCopy = createCopyButton(card.content, "Copier");
      const bUp = createFeedbackButton(null, "Satisfaisant");
      const bDown = createNegativeFeedbackButton(null, "Insatisfaisant");

      letterRow.append(bCorr, spacer, bCopy, bUp, bDown);
      letterActions.append(letterRow);
      cardContent.append(letterActions);
    }

    // Si c'est la dernière réponse de correction, ajouter les actions
    if (isLastResponse && card.type === "correction-response" && actions) {
      cardContent.append(actions);
    }
  } else {
    // Appliquer le même background pour les demandes de correction et de courrier
    if (card.type === "correction-request" || card.type === "letter-request") {
      cardContent.classList.add("bg-info");
    }

    // Pour les cartes de demande (request), ajouter l'horodatage à droite du label
    if (card.type === "correction-request" || card.type === "letter-request") {
      const labelRow = create("div", "flex-between mb8");
      const timestamp = create("span", "fs12 muted", card.time || nowTime());
      cardLabel.classList.remove("mb8");
      labelRow.append(cardLabel, timestamp);
      cardContainer.append(labelRow, cardContent);
    } else {
      cardContainer.append(cardLabel, cardContent);
    }
  }

  return cardContainer;
}

/* ------------------------------------------------------------------
   Rendu d'un bloc CR repliable (question + réponse + actions)
------------------------------------------------------------------- */
function makeCrBlock(doc, idx) {
  const block = create("div", "cr-block open");
  block.dataset.id = String(doc.id ?? idx);

  // Header "titre + x" (barre cliquable pour open/close)
  const hCollapse = create("div", "cr-header");

  // Groupe gauche : horodatage + titre
  const headerLeft = create("div", "cr-header-left flex-align-center gap-12");
  const timestamp = create("span", "fs12 muted", doc.time || nowTime());
  const titleBtn = create("button", "cr-title", titleForDoc(doc, idx));
  titleBtn.type = "button";
  titleBtn.onclick = () => toggleBlock(block, true);

  headerLeft.append(timestamp, titleBtn);

  const headerRight = create("div", "cr-header-right");
  const chevronBtn = create("button", "cr-toggle fs16", "v");
  chevronBtn.onclick = (e) => {
    e.stopPropagation();
    toggleBlock(block);
  };
  const closeBtn = create("button", "cr-close fs12", "×");
  closeBtn.setAttribute("aria-label", "Supprimer ce bloc");
  closeBtn.onclick = (e) => {
    e.stopPropagation();
    deleteBlockByEl(block);
  };
  headerRight.append(chevronBtn, closeBtn);
  hCollapse.append(headerLeft, headerRight);

  // Contenu (question / réponse)
  const content = create("div", "cr-content");

  // Label de la question avec horodatage à droite
  const qLabelRow = create("div", "flex-between mb8");
  const qLabel = create("div", "cr-section-label", "");
  const qTimestamp = create("span", "fs12 muted", doc.time || nowTime());
  qLabelRow.append(qLabel, qTimestamp);

  const question = create("div", "cr-question fs14 p12", doc.question || "");
  const aLabel = create("div", "cr-section-label", "");
  const answer = create(
    "div",
    "cr-answer fs14 p12",
    doc.answer || doc.content || ""
  );

  // Entête IA (toujours demandé dans chaque bloc)
  const header = create("div", "doc-header", "");

  // Pour les courriers, afficher le badge selon le destinataire
  let badgeLabel;
  if (doc.docType === "courrier") {
    badgeLabel = doc.letterRecipient === "patient" ? "IA Patient" : "IA Confrère";
  } else {
    badgeLabel = doc.iaMode ? `${doc.iaMode}` : "IA Spécialisé";
  }
  const badge = create("span", "badge-ia", badgeLabel);

  const rightGroup = create("div", "header-right");
  const checkIcon = create("button", "btn btn-icon fs12");
  checkIcon.dataset.tooltip = "Injecté dans le RIS";
  checkIcon.appendChild(SVG("check", { size: 18 }));
  const timeSpan = create("span", " muted fs12", "(3s)");
  const hour = create("span", "btn-icon fs12", `${doc.time}`);
  rightGroup.append(checkIcon, timeSpan, hour);
  header.append(badge, rightGroup);

  // Si ton projet expose renderDictatedContent(doc), on l'utilise pour la réponse
  let renderedAnswer = "";
  try {
    // eslint-disable-next-line no-undef
    if (
      typeof renderDictatedContent === "function" &&
      doc &&
      (doc.content || doc.answer)
    ) {
      // priorité au formatage existant si "content" présent
      renderedAnswer = renderDictatedContent(doc);
    }
  } catch (_) {}

  question.textContent =
    doc.question ||
    (doc.dictated ? doc.dictated.join(", ") : "Demande : (exemple)");
  if (renderedAnswer) {
    const container = create("div");
    container.innerHTML = renderedAnswer;
    answer.append(container);
  } else {
    answer.textContent = doc.answer || doc.content || "Réponse : (exemple)";
  }

  // Actions sous la réponse (Corriger, Cohérence, Copier, 👍, 👎)
  const actions = create("div", "doc-actions mt12");
  const row = create("div", "btn-row");
  const bCorr = create("button", "btn btn-corriger fs12");
  bCorr.dataset.tooltip = "Corriger le compte rendu";
  bCorr.append(SVG("edit", { size: 18 }), create("span", "", " Corriger"));
  bCorr.onclick = () => {
    state.correctionMode = true;
    state.correctionInput = "";
    state.activeCorrectionDocId = doc.id ?? idx;
    window.render();
  };

  const spacer = create("div", "flex-1");

  const bCoherence = createIconButton("check", () => {
    const active = bCoherence.classList.toggle("active-coherence");
    bCoherence.dataset.tooltip = active ? "Cohérence activée" : "Cohérence";

    // Cible ou crée une seule zone texte
    let textEl = answer.querySelector(".answer-text");
    if (!textEl) {
      const textWrapper = document.createElement("div");
      textWrapper.className = "answer-text";
      textWrapper.innerHTML = doc.content;
      // on transfère le texte existant s'il n'est pas encore encapsulé
      const oldText = answer.firstChild;
      if (oldText && !oldText.classList?.contains("answer-text")) {
        answer.insertBefore(textWrapper, oldText);
        oldText.remove();
      } else {
        answer.prepend(textWrapper);
      }
      textEl = textWrapper;
    }

    // Désactivation → on remet le texte original sans duplication
    if (!active) {
      textEl.innerHTML = doc.content;
      return;
    }

    // Activation → surlignage des mots du tableau dictated[]
    if (Array.isArray(doc.dictated)) {
      let html = doc.content;
      doc.dictated.forEach((phrase) => {
        const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(escaped, "gi");
        html = html.replace(regex, `<mark>${phrase}</mark>`);
      });
      textEl.innerHTML = html;
    }
  }, "Cohérence", 18);

  const bLetter = createIconButton("envelope", () => {
    state.letterMode = true;
    state.letterInput = "";
    state.activeLetterDocId = doc.id ?? idx;
    state.letterRecipient = "confrere"; // défaut
    window.render();
  }, "Rédiger un courrier", 18);
  bLetter.classList.add("letter-btn");

  const bCopy = createCopyButton(doc.content, "Copier");
  const bUp = createFeedbackButton(null, "Satisfaisant");
  const bDown = createNegativeFeedbackButton(null, "Insatisfaisant");

  // Ne pas afficher le bouton "Rédiger un courrier" si c'est déjà un courrier
  if (doc.docType === "courrier") {
    row.append(bCorr, spacer, bCoherence, bCopy, bUp, bDown);
  } else {
    row.append(bCorr, spacer, bCoherence, bLetter, bCopy, bUp, bDown);
  }
  actions.append(row);

  // Si des cartes de correction existent, ne pas ajouter les actions ici
  const hasCorrectionResponse = Array.isArray(doc.cards) && doc.cards.some(card => card.type === "correction-response");
  if (!hasCorrectionResponse) {
    answer.append(actions);
  }

  content.append(qLabelRow, question, header, aLabel, answer);

  // Ajouter les cartes additionnelles (corrections, courriers) si elles existent
  if (Array.isArray(doc.cards) && doc.cards.length > 0) {
    // Trouver l'index de la dernière carte de type réponse (correction-response ou letter-response)
    let lastResponseIndex = -1;
    for (let i = doc.cards.length - 1; i >= 0; i--) {
      if (doc.cards[i].type === "correction-response" || doc.cards[i].type === "letter-response") {
        lastResponseIndex = i;
        break;
      }
    }

    doc.cards.forEach((card, index) => {
      const isLastResponse = index === lastResponseIndex && lastResponseIndex !== -1;
      const cardEl = makeAdditionalCard(card, doc, isLastResponse, isLastResponse && card.type === "correction-response" ? actions : null);
      content.append(cardEl);
    });
  }

  block.append(hCollapse, content);
  return block;
}

/* ------------------------------------------------------------------
   Rendu principal
------------------------------------------------------------------- */
export function renderReportTab() {
  const wrap = create("div", "main-container");
  const list = create("div", "list p12");

  // Ne rien générer au démarrage : on respecte strictement le contenu de state.js
  // Si state.js est vide, rien ne s'affiche
  if (!Array.isArray(state.crHistory)) state.crHistory = [];

  // Génère chaque bloc (nouveaux vont EN DESSOUS, on garde les anciens collapsed)
  state.crHistory.forEach((doc, idx) => {
    const block = makeCrBlock(doc, idx);
    if (idx < state.crHistory.length - 1) block.classList.add("collapsed");
    list.append(block);
  });

  // Note + commandes globales
  const info = create(
    "div",
    "info-text fs14 muted center",
    `Chaque dictée génère un nouveau compte rendu. Pour affiner, cliquez sur "Corriger".`
  );

  const controls = create("div", "history-controls");

  // Afficher la corbeille uniquement s'il y a au moins un CR ou Courrier
  if (state.crHistory.length > 0) {
    const deleteAll = create("button", "delete-btn fs12");
    deleteAll.dataset.tooltip = "Effacer";
    deleteAll.appendChild(SVG("delete", { size: 18 }));
    deleteAll.onclick = () => {
      state.crHistory = []; // supprime tout, sans recréer quoi que ce soit
      window.render();
    };
    controls.append(deleteAll);
  }

  list.append(info, controls);
  wrap.append(list);

  /* ---- Panneau bas : textarea + dropdowns (à gauche) + mic/envoyer (à droite) ---- */
  if (!state.correctionMode && !state.letterMode) {
    const form = create("div", "cr-input-container dictation-panel p12");
    const inputRow = create("div", "cr-top-row mb8");
    const textarea = create("textarea", "cr-textarea");
    textarea.placeholder = "Dictez vos observations...";
    textarea.value = state.dictatedText;

    // Clic/focus → collapse tout (on garde seulement les headers titres visibles)
    textarea.addEventListener("focus", collapseAllBlocks);
    textarea.addEventListener("click", collapseAllBlocks);

    textarea.oninput = (e) => (state.dictatedText = e.target.value);
    inputRow.append(textarea);
    form.append(inputRow);

    // Barre d'actions bas : dropdowns à gauche, mic + envoyer à droite
    const actions = create("div", "cr-actions w100");
    const ddMode = makeDropdown(
      "Compte-rendu",
      ["Compte-rendu", "Courrier"],
      (val) => {
        const letterBtn = document.querySelector(".letter-btn");
        if (val === "Compte-rendu") {
          ddIA.root.classList.remove("d-none");
          ddIA.root.classList.add("d-flex");
          ddLetter.root.classList.add("d-none");
          ddLetter.root.classList.remove("d-flex");
          textarea.placeholder = "Dictez vos observations...";
          if (letterBtn) letterBtn.classList.remove("active-letter");
        } else {
          ddIA.root.classList.add("d-none");
          ddIA.root.classList.remove("d-flex");
          ddLetter.root.classList.remove("d-none");
          ddLetter.root.classList.add("d-flex");
          textarea.placeholder = "Rédiger un courrier a partir du Compte-rendu sélectionné";
        }
      },
      "dd-mode"
    );

    const ddIA = makeDropdown(
      "IA classique",
      ["IA classique", "IA enrichie", "IA Marty"],
      (val) => {
        const v = val.toLowerCase();
        if (v.includes("classique")) state.crDocType = "generique";
        else if (v.includes("enrichie")) state.crDocType = "specialise";
        else state.crDocType = "marty";
      },
      "dd-ia"
    );

    const ddLetter = makeDropdown(
      "Confrère",
      ["Confrère", "Patient"],
      (val) => {
        state.letterAudience = val.toLowerCase();
      },
      "dd-letter d-none"
    );

    const rightGroup = create("div", "cr-right-group");
    const micBtn = create("button", "cr-btn mic-btn fs12 p8");
    micBtn.appendChild(SVG("mic", { size: 20, color: "white" }));
    micBtn.dataset.tooltip = "Dicter";
    micBtn.onclick = () => {
      textarea.focus();
    };

    const sendBtn = create("button", "cr-btn send-btn fs12 p8");
    sendBtn.appendChild(SVG("send", { size: 20, color: "white" }));
    sendBtn.dataset.tooltip = "Envoyer";
    sendBtn.onclick = () => {
      const text = (state.dictatedText || "").trim();
      const n = state.crHistory.filter((d) => !d.isExample).length + 1;

      // Vérifier le mode sélectionné (Compte-rendu ou Courrier)
      const modeDropdownDisplay = document.querySelector(".dd.dd-mode .dd-display");
      const isCourrierMode = modeDropdownDisplay && modeDropdownDisplay.textContent === "Courrier";

      const newDoc = {
        id: Date.now(),
        time: nowTime(),
        title: `Titre ${n}`, // <— titre figé
        question: (state.dictatedText || "").trim(), // on respecte ce que tu as saisi
        answer: isCourrierMode ? `Courrier ${n}` : `Compte-rendu ${n}`, // réponse factice immédiate
        content: isCourrierMode ? `Cher ${state.letterRecipient === "patient" ? "patient" : "confrère"},\n\n${state.dictatedText}\n\nCordialement,` : `Compte-rendu ${n}`,
        iaMode: "Spécialisé", // valeur par défaut si aucun dropdown trouvé
        docType: isCourrierMode ? "courrier" : "compte-rendu",
        letterRecipient: isCourrierMode ? state.letterRecipient : undefined,
        cards: [],
      };

      // Ajuster le type IA selon le mode choisi dans le dropdown
      const iaDisplay = document.querySelector(".dd.dd-ia .dd-display");
      if (iaDisplay) {
        newDoc.iaMode = iaDisplay.textContent.replace("Mode ", "").trim();
      }

      // Ajout EN DESSOUS
      state.crHistory.push(newDoc);

      // Reset champ
      state.dictatedText = "";
      textarea.value = "";

      // Re-render + ouvrir le dernier bloc uniquement
      window.render();
      requestAnimationFrame(() => {
        const blocks = document.querySelectorAll(".cr-block");
        blocks.forEach((b, i) => {
          if (i < blocks.length - 1) b.classList.add("collapsed");
          else b.classList.remove("collapsed");
        });
      });
    };

    rightGroup.append(micBtn, sendBtn);
    actions.append(ddMode.root, ddIA.root, ddLetter.root, rightGroup);
    form.append(actions);
    wrap.append(form);
  } else if (state.correctionMode) {
    // Panneau correction
    const panel = create("div", "p12 correction-panel");
    const header = create("div", "correction-header mb12 fs20 w100");
    const title = create(
      "label",
      "fs14 bold",
      "Qu'aimeriez-vous corriger ?"
    );
    const close = create("button", "btn-icon fs18 muted close", "×");
    close.onclick = () => {
      state.correctionMode = false;
      state.correctionInput = "";
      state.activeCorrectionDocId = null;
      window.render();
    };
    header.append(title, close);
    panel.append(header);

    const row = create("div", "cr-top-row mn8");
    const textarea = create("textarea", " correction-textarea");
    textarea.placeholder = "Décrivez votre correction...";
    textarea.value = state.correctionInput;
    textarea.oninput = (e) => (state.correctionInput = e.target.value);

    const btnGroup = create("div", "correct-group");
    const mic = create("button", "cr-btn mic-btn fs12");
    mic.appendChild(SVG("mic"));
    mic.dataset.tooltip = "Dicter";
    mic.onclick = () => textarea.focus();

    const send = create("button", "cr-btn send-btn fs12 p8");
    send.appendChild(SVG("send", { size: 20, color: "white" }));
    send.dataset.tooltip = "Envoyer";
    send.onclick = () => {
      const targetDoc = state.crHistory.find(
        (d, i) => (d.id ?? i) === state.activeCorrectionDocId
      );
      if (!targetDoc) return;

      // Initialiser cards si nécessaire
      if (!Array.isArray(targetDoc.cards)) {
        targetDoc.cards = [];
      }

      // Ajouter la demande de correction
      targetDoc.cards.push({
        type: "correction-request",
        content: state.correctionInput,
        time: nowTime(),
      });
      // Ajouter la réponse correction (simulée)
      targetDoc.cards.push({
        type: "correction-response",
        content: `${targetDoc.content}\n\nCorrection appliquée : ${state.correctionInput}`,
        time: nowTime(),
      });

      // Fermer le panneau
      state.correctionMode = false;
      state.correctionInput = "";
      state.activeCorrectionDocId = null;
      window.render();
    };
    btnGroup.append(mic, send);

    row.append(textarea);
    panel.append(row, btnGroup);
    wrap.append(panel);
  } else if (state.letterMode) {
    // Panneau rédaction de courrier
    const panel = create("div", "p12 correction-panel");
    const header = create("div", "correction-header mb12 fs20 w100");
    const title = create(
      "label",
      "fs14 bold",
      "Rédiger un courrier"
    );
    const close = create("button", "btn-icon fs18 muted close", "×");
    close.onclick = () => {
      state.letterMode = false;
      state.letterInput = "";
      state.activeLetterDocId = null;
      window.render();
    };
    header.append(title, close);
    panel.append(header);

    // Dropdown pour choisir le destinataire
    const ddLetter = makeDropdown(
      "Confrère",
      ["Confrère", "Patient"],
      (val) => {
        state.letterRecipient = val.toLowerCase();
      },
      "dd-letter mb12"
    );
    panel.append(ddLetter.root);

    const row = create("div", "cr-top-row mn8");
    const textarea = create("textarea", " correction-textarea");
    textarea.placeholder = "Ajoutez des instructions pour personnaliser le courrier...";
    textarea.value = state.letterInput;
    textarea.oninput = (e) => (state.letterInput = e.target.value);

    const btnGroup = create("div", "correct-group");
    const mic = create("button", "cr-btn mic-btn fs12");
    mic.appendChild(SVG("mic"));
    mic.dataset.tooltip = "Dicter";
    mic.onclick = () => textarea.focus();

    const send = create("button", "cr-btn send-btn fs12 p8");
    send.appendChild(SVG("send", { size: 20, color: "white" }));
    send.dataset.tooltip = "Envoyer";
    send.onclick = () => {
      const targetDoc = state.crHistory.find(
        (d, i) => (d.id ?? i) === state.activeLetterDocId
      );
      if (!targetDoc) return;

      // Initialiser cards si nécessaire
      if (!Array.isArray(targetDoc.cards)) {
        targetDoc.cards = [];
      }

      // Ajouter la demande de courrier
      targetDoc.cards.push({
        type: "letter-request",
        content: state.letterInput || "Générer un courrier",
        time: nowTime(),
      });

      // Ajouter la réponse courrier (simulée)
      const recipient = state.letterRecipient || "confrere";
      targetDoc.cards.push({
        type: "letter-response",
        content: `Cher ${recipient === "patient" ? "patient" : "confrère"},\n\nSuite au compte-rendu ci-dessus, je me permets de vous écrire.\n\n${state.letterInput}\n\nCordialement,`,
        time: nowTime(),
        letterRecipient: recipient,
      });

      // Fermer le panneau
      state.letterMode = false;
      state.letterInput = "";
      state.activeLetterDocId = null;
      window.render();
    };
    btnGroup.append(mic, send);

    row.append(textarea);
    panel.append(row, btnGroup);
    wrap.append(panel);
  }

  return wrap;
}
