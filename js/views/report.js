// views/cr.js
import { create } from "../utils/dom.js";
import { state } from "../state/state.js";
import { nowTime } from "../utils/time.js";
import { SVG } from "../utils/svg-icons.js";

/* ------------------------------------------------------------------
   Dropdown générique (conserve ton API + fermeture au clic extérieur)
------------------------------------------------------------------- */
function makeDropdown(defaultLabel, options, onSelect, extraClass = "") {
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
    document
      .querySelectorAll(".menu-dropdown")
      .forEach((m) => (m.style.display = "none"));
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  root.append(display, menu);
  return { root, display, menu, setLabel: (s) => (display.textContent = s) };
}

if (!window.__crDropdownOutsideCloseInstalled) {
  window.__crDropdownOutsideCloseInstalled = true;
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".menu-dropdown")
      .forEach((m) => (m.style.display = "none"));
  });
}

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
   Titre pour un doc (utilisé par le header d’un bloc)
------------------------------------------------------------------- */
function titleForDoc(doc, idx) {
  // L’existant du state.js est respecté : si le doc vient du state avec un title déjà "Réponse n", on l’affiche tel quel
  if (doc.isExample) return "RUPTURE LIGAMENT CROISÉ ANTÉRIEUR GENOU GAUCHE";
  const nonExampleList = state.crHistory.filter((d) => !d.isExample);
  const pos = Math.max(1, nonExampleList.indexOf(doc) + 1);
  return `Titre ${pos}`;
}

/* ------------------------------------------------------------------
   Rendu d’un bloc CR repliable (question + réponse + actions)
------------------------------------------------------------------- */
function makeCrBlock(doc, idx) {
  const block = create("div", "cr-block open");
  block.dataset.id = String(doc.id ?? idx);

  // Header "titre + x" (barre cliquable pour open/close)
  const hCollapse = create("div", "cr-header");
  const titleBtn = create("button", "cr-title", titleForDoc(doc, idx));
  titleBtn.type = "button";
  titleBtn.onclick = () => toggleBlock(block, true);

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
  hCollapse.append(titleBtn, headerRight);

  // Contenu (question / réponse)
  const content = create("div", "cr-content");
  const qLabel = create("div", "cr-section-label", "");
  const question = create("div", "cr-question fs14 p12", doc.question || "");
  const aLabel = create("div", "cr-section-label", "");
  const answer = create(
    "div",
    "cr-answer fs14 p12",
    doc.answer || doc.content || ""
  );

  // Entête IA (toujours demandé dans chaque bloc)
  const header = create("div", "doc-header", "");
  const badgeLabel = doc.iaMode ? `🧠 ${doc.iaMode}` : "🧠 IA Spécialisé";
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
    window.render();
  };

  const spacer = create("div");
  spacer.style.flex = "1";

  const bCoherence = create("button", "btn btn-icon fs12");
  bCoherence.dataset.tooltip = "Cohérence";
  bCoherence.appendChild(SVG("check", { size: 18 }));
  bCoherence.style.padding = "2px 4px";

  bCoherence.onclick = () => {
    const active = bCoherence.classList.toggle("active-coherence");
    bCoherence.dataset.tooltip = active ? "Cohérence activée" : "Cohérence";

    // Cible ou crée une seule zone texte
    let textEl = answer.querySelector(".answer-text");
    if (!textEl) {
      const textWrapper = document.createElement("div");
      textWrapper.className = "answer-text";
      textWrapper.innerHTML = doc.content;
      // on transfère le texte existant s’il n’est pas encore encapsulé
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
  };

  const bLetter = create("button", "btn btn-icon fs12 letter-btn");
  bLetter.dataset.tooltip = "Rédiger un courrier";
  const letterIcon = SVG("envelope", { size: 18 });
  bLetter.appendChild(letterIcon);
  bLetter.style.padding = "2px 4px";

  bLetter.onclick = () => {
    const modeDisplay = document.querySelector(".dd.dd-mode .dd-display");
    const iaBlock = document.querySelector(".dd.dd-ia");
    const letterBlock = document.querySelector(".dd.dd-letter");
    const isRed = bLetter.classList.contains("active-letter");
    if (isRed) {
      bLetter.classList.remove("active-letter");
    } else {
      bLetter.classList.add("active-letter");
      if (modeDisplay) modeDisplay.textContent = "Courrier";
      if (iaBlock) iaBlock.style.display = "none";
      if (letterBlock) letterBlock.style.display = "flex";
    }
    state.selectedCrForLetter = doc;
  };

  const bCopy = create("button", "btn btn-icon fs12");
  bCopy.dataset.tooltip = "Copier";
  bCopy.appendChild(SVG("copy", { size: 18 }));
  bCopy.style.padding = "2px 4px";
  bCopy.onclick = async () => {
    try {
      await navigator.clipboard.writeText(doc.content);
      alert("✓ Copié !");
    } catch {
      alert("Impossible de copier");
    }
  };

  const bUp = create("button", "btn btn-icon fs12");
  bUp.dataset.tooltip = "Satisfaisant";
  bUp.appendChild(SVG("thumb_up", { size: 18 }));
  bUp.style.padding = "2px 4px";
  bUp.onclick = () => {
    alert("Merci pour votre retour!");
  };

  const bDown = create("button", "btn btn-icon fs12");
  bDown.dataset.tooltip = "Insatisfaisant";
  bDown.appendChild(SVG("thumb_down", { size: 18 }));
  bDown.style.padding = "2px 4px";
  bDown.onclick = () => {
    alert("Retour pris en compte!");
  };

  row.append(bCorr, spacer, bCoherence, bLetter, bCopy, bUp, bDown);
  actions.append(row);
  answer.append(actions);

  content.append(qLabel, question, header, aLabel, answer);

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
  const openAll = create("button", "reopen-btn fs12", "Ouvrir historique");
  openAll.onclick = () => {
    document
      .querySelectorAll(".cr-block.collapsed")
      .forEach((b) => b.classList.remove("collapsed"));
  };

  const deleteAll = create("button", "delete-btn fs12");
  deleteAll.dataset.tooltip = "Effacer";
  deleteAll.appendChild(SVG("delete", { size: 18 }));
  deleteAll.onclick = () => {
    state.crHistory = []; // supprime tout, sans recréer quoi que ce soit
    window.render();
  };

  list.append(info, controls);
  controls.append(openAll, deleteAll);
  wrap.append(list);

  /* ---- Panneau bas : textarea + dropdowns (à gauche) + mic/envoyer (à droite) ---- */
  if (!state.correctionMode) {
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

    // Barre d’actions bas : dropdowns à gauche, mic + envoyer à droite
    const actions = create("div", "cr-actions w100");
    const ddMode = makeDropdown(
      "Compte-rendu",
      ["Compte-rendu", "Courrier"],
      (val) => {
        const letterBtn = document.querySelector(".letter-btn");
        if (val === "Compte-rendu") {
          ddIA.root.style.display = "flex";
          ddLetter.root.style.display = "none";
          if (letterBtn) letterBtn.classList.remove("active-letter");
        } else {
          ddIA.root.style.display = "none";
          ddLetter.root.style.display = "flex";
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
      "dd-letter"
    );
    ddLetter.root.style.display = "none";

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
      const newDoc = {
        id: Date.now(),
        time: nowTime(),
        title: `Titre ${n}`, // <— titre figé
        question: (state.dictatedText || "").trim(), // on respecte ce que tu as saisi
        answer: `Compte-rendu ${n}`, // réponse factice immédiate
        iaMode: "Spécialisé", // valeur par défaut si aucun dropdown trouvé
      };

      // Ajuster le type IA selon le mode choisi dans le dropdown
      const modeDisplay = document.querySelector(".dd.dd-ia .dd-display");
      if (modeDisplay) {
        newDoc.iaMode = modeDisplay.textContent.replace("Mode ", "").trim();
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
  } else {
    // Panneau correction
    const panel = create("div", "p12 correction-panel");
    const header = create("div", "correction-header mb12 fs20 w100");
    const title = create("label", "fs14 bold", "Qu'aimeriez-vous corriger ?");
    const close = create("button", "btn-icon fs18 muted close", "×");
    close.onclick = () => {
      state.correctionMode = false;
      state.correctionInput = "";
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
    btnGroup.append(mic, send);

    row.append(textarea);
    panel.append(row, btnGroup);
    wrap.append(panel);
  }

  return wrap;
}
