// views/voice.js
import { create } from "../utils/dom.js";
import { SVG } from "../utils/svg-icons.js";

export function renderVoiceDictTab() {
  const w = create("div", "content");

  const microSection = create("div", "micro-section center");
  const microButton = create("button");
  microButton.id = "microButton";
  const microIcon = create("div", "micro-icon");
  microIcon.appendChild(SVG("mic", { size: 48 }));
  microIcon.id = "microIcon";
  microButton.appendChild(microIcon);
  const statusText = create("p", "fs14 semi-bold", "Prêt à dicter");
  statusText.id = "statusText";
  microSection.append(microButton, statusText);
  w.appendChild(microSection);

  const waveContainer = create("div", "wave-container hidden");
  waveContainer.innerHTML = "<div></div><div></div><div></div><div></div>";
  microIcon.appendChild(waveContainer);

  const infoCard = create("div", "info-card");
  infoCard.id = "infoCard";
  const detectedField = create("div", "detected-field");
  detectedField.innerHTML = `
    <span>📍</span>
    <div>
      <p class="label fs14">Champ détecté:</p>
      <p id="detectedField" class="mono">Aucun champ détecté</p>
    </div>
  `;
  infoCard.appendChild(detectedField);

  const tip = create("div", "tip");
  tip.innerHTML = `<p id="tipText"></p>`;
  infoCard.appendChild(tip);
  w.appendChild(infoCard);

  const voiceBox = create("div", "voice-box fs14 p16");
  voiceBox.innerHTML = `
    <strong>Comment ça marche:</strong><br />
    1. Cliquez dans un champ texte <br />
    2. Appuyez sur votre SpeechMike<br />
    3. Parlez<br />
    4. Relâchez le bouton pour terminer ou attendez 3 secondes de silence.
  `;
  w.appendChild(voiceBox);

  const textexempleSection = create("div", "textexemple-section");
  const textexempleLabel = create("label", "fs12 semi-bold", "CHAMPS TEST");
  const textexemple = create("textarea", "fs14");
  textexemple.id = "ristextarea";
  textexemple.placeholder = "RIS - Résultats";
  const floatingMic = create("div", "floating-mic d-none");
  floatingMic.appendChild(SVG("mic", { size: 24 }));
  floatingMic.id = "floatingMic";
  textexempleSection.append(textexempleLabel, textexemple, floatingMic);
  w.appendChild(textexempleSection);
  textexemple.addEventListener("focus", () => {
    floatingMic.classList.remove("d-none");
    floatingMic.classList.add("d-block");
  });

  textexemple.addEventListener("blur", () => {
    if (state !== "active") {
      floatingMic.classList.add("d-none");
      floatingMic.classList.remove("d-block");
    }
  });

  let state = "inactive";
  const textarea = textexemple;
  const microBtn = microButton;
  const microIcn = microIcon;
  const statusTxt = statusText;

  const infoC = infoCard;
  const detectedF = detectedField.querySelector("#detectedField");

  let dictationTextElement = document.createElement("div");
  dictationTextElement.classList.add("dictation-text", "p8", "fs14");
  infoC.insertBefore(dictationTextElement, tip);

  const fullText =
    "On note une opacité nodulaire de 3 cm au lobe supérieur droit sans foyer condensant";
  let currentDictation = "";
  let dictationInterval;

  const updateUI = () => {
    infoC.className = "info-card";
    microIcn.className = "micro-icon";

    if (state === "active") {
      statusTxt.textContent = "🎤 Dictée active - En écoute...";
      microIcn.classList.add("active");
      waveContainer.classList.remove("hidden");
      microIcn.textContent = "";
      microIcn.appendChild(waveContainer);
      infoC.classList.add("active");
      dictationTextElement.classList.remove("d-none");
      dictationTextElement.classList.add("d-block");
      floatingMic.classList.remove("d-none");
      floatingMic.classList.add("d-block", "visible");
    } else if (state === "processing") {
      statusTxt.textContent = "⟳ Traitement en cours...";
    } else if (state === "success") {
      statusTxt.textContent = "✓ Texte inséré avec succès";
      microIcn.classList.add("success");
      waveContainer.classList.add("hidden");
      microIcn.textContent = "✓";
      infoC.classList.add("success");
      if (textexemple) textexemple.value = currentDictation.trim();
      dictationTextElement.classList.add("d-none");
      dictationTextElement.classList.remove("d-block");
      floatingMic.classList.add("d-none");
      floatingMic.classList.remove("d-block");

      setTimeout(() => {
        state = "inactive";
        updateUI();
      }, 2500);
    } else {
      statusTxt.textContent = "Prêt à dicter";
      microIcn.classList.remove("active", "success", "error");
      waveContainer.classList.add("hidden");
      microIcn.innerHTML = "";
      microIcn.appendChild(SVG("mic", { size: 48 }));
      infoC.classList.remove("active", "success", "error");
      dictationTextElement.classList.add("d-none");
      dictationTextElement.classList.remove("d-block");
    }
  };

  document.addEventListener("focus", detectActiveField, true);
  document.addEventListener("blur", detectActiveField, true);
  window.addEventListener("click", detectActiveField);

  function detectActiveField() {
    const active = document.activeElement;
    if (
      active &&
      (active.tagName === "TEXTAREA" || active.contentEditable === "true")
    ) {
      const name =
        active.name || active.id || active.placeholder || "Champ texte";
      detectedF.textContent = `[${name}]`;
    } else {
      detectedF.textContent = "Aucun champ détecté";
    }
  }

  microBtn.addEventListener("click", () => {
    if (state === "inactive") {
      state = "active";
      if (textarea) textarea.value = "";
      dictationTextElement.textContent = "";
      currentDictation = "";
      startDictation();
    } else if (state === "active") {
      state = "processing";
      clearInterval(dictationInterval);
      setTimeout(() => {
        state = "success";
        updateUI();
      }, 800);
    }
    updateUI();
  });

  function startDictation() {
    let index = 0;
    dictationInterval = setInterval(() => {
      if (index < fullText.length) {
        index += Math.floor(Math.random() * 4) + 1;
        currentDictation = fullText.substring(0, index);
        dictationTextElement.textContent = currentDictation;
      } else {
        clearInterval(dictationInterval);
        state = "processing";
        updateUI();
        setTimeout(() => {
          state = "success";
          updateUI();
        }, 1000);
      }
    }, 200);
  }

  return w;
}
