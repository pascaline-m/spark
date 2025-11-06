// views/settings.js
import { create, el } from "../utils/dom.js";
import { state } from "../state/state.js";

export function renderSettings() {
  document
    .querySelectorAll("[data-stab]")
    .forEach((b) =>
      b.classList.toggle("active", b.dataset.stab === state.settingsTab)
    );
  const root = el("#settingsContent");
  root.innerHTML = "";
  if (state.settingsTab === "preferences") {
    const wrap = create("div", "content");
    const s1 = create("div");
    s1.append(create("div", "fs13 bold mb12", "Langue & Affichage"));
    const lang = create("div", "mb12");
    lang.innerHTML = `<label class="fs12 bold mb6" style="display:block">Langue</label><select class="select w100 p8"><option>Français</option><option>English</option></select>`;
    const theme = create("div", "mb12");
    theme.innerHTML = `<label class="fs12 bold mb6" style="display:block">Préférence d'affichage</label><select class="select w100 p8"><option>Automatique</option><option>Clair</option><option>Sombre</option></select>`;
    s1.append(lang, theme);
    wrap.append(s1);
    const s2 = create("div");
    s2.append(create("div", "fs13 bold mb12", "Par défaut à l'ouverture"));
    s2.innerHTML += `<div class="mb12">        <div class="mb12"><label class="fs12 bold mb6" style="display:block">Mode IA</label><div class="fs11 muted mt6">Choisissez le mode par défaut lors du démarrage.</div><select class="select w100 p8"><option>Classique</option><option>Enrichi</option><option>Marty</option></select></div>

    <label class="fs12 bold mb6" style="display:block">Onglet</label><div class="fs11 muted mt6">Sélectionnez l'onglet qui s'affiche lors de l'ouverture de l'extension.</div><select class="select w100 p8">
    <option>Spark</option><option>Voice</option></select>
</div>`;
    wrap.append(s2);
    const s3 = create("div");
    s3.append(create("div", "fs13 bold mb12", "Injection dans le RIS"));
    s3.innerHTML += `<div class="mb12"><div class="p6" style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="ris-auto" checked style="width:16px;height:16px;cursor:pointer;margin-top:2px"/><label class="fs12" for="ris-auto" style="cursor:pointer;flex:1">Automatique</label></div><div class="fs11 muted mt6">Injecte automatiquement les comptes rendus dans votre RIS après génération.</div></div><div class="mb12"><div class="p6" style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="all-domains" style="width:16px;height:16px;cursor:pointer;margin-top:2px"/><label class="fs12" for="all-domains" style="cursor:pointer;flex:1">Autoriser tous les domaines</label></div><div class="fs11 muted mt6">Permettre à Spark d'injecter du contenu dans n'importe quelle page. Nécessaire pour l'intégration RIS lorsqu'il est déployé sur un réseau local.</div></div>`;
    wrap.append(s3);
    const s4 = create("div");
    s4.append(create("div", "fs13 bold mb12", "Extension"));
    const b1 = create(
      "button",
      "btn w100 fs11 mb12",
      "Vérifier les mises à jour"
    );
    const b2 = create(
      "button",
      "btn w100 fs11 mb12",
      "Générer un rapport de débogage"
    );
    s4.append(b1, b2);
    wrap.append(s4);
    root.append(wrap);
  } else if (state.settingsTab === "devices") {
    const wrap = create("div", "content");
    const s1 = create("div");
    s1.append(create("div", "fs13 bold mb12", "Connexion"));
    const c1 = create(
      "button",
      "btn w100 fs11 mb12 bold connect-speechmike",
      "CONNECTER UN SPEECHMIKE"
    );
    s1.append(c1);
    const s2 = create("div");
    s2.append(create("div", "fs13 bold mb12", "SpeechMike"));
    const info = create(
      "div",
      "fs11 mb10",
      `<strong>État:</strong> Connecté<br/><br/><strong>Modèle:</strong> Philips SpeechMike Premium LFH3500<br/><br/><strong>Firmware:</strong> v3.2.1`
    );
    info.style.background = "#f9f9f9";
    info.style.padding = "8px";
    info.style.border = "1px solid #e0e0e0";
    info.style.borderRadius = "3px";
    s2.append(info);
    const selector = create("div", "mb12");
    selector.innerHTML = `
  <label class="fs12 bold mb6" style="display:block; margin-top:20px">
    Bouton SpeechMike
  </label>
  <select class="select w100 p8" onchange="updateModeDescription()">
    <option value="spark">Spark uniquement</option>
    <option value="universal" selected>Voice (mode universel)</option>
    <option value="targeted">Voice avec RIS + Gmail autorisés</option>
  </select>
  <div id="mode-desc" class="mode-description" style="border-left:2px solid #0f5f7f;background:#f9f9f9;padding:8px;border-radius:2px;margin-top:8px;font-size:11px;line-height:1.4">
    <strong>Mode universel:</strong>
    Dictez dans n'importe quel formulaire du web. Utilisez pour: Emails, RIS, formulaires.
  </div>
`;
    s2.append(selector);
    const s3 = create("div");

    s3.append(create("div", "fs13 bold mb12", "Comportement"));
    const cb = create("div", "mb12");
    cb.innerHTML = `<label class="fs12 bold mb6" style="display:block">Exiger le focus pour SpeechMike</label><br><div style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="focus-required" checked style="width:16px;height:16px;cursor:pointer;margin-top:2px"/><label class="fs12" for="focus-required" style="cursor:pointer;flex:1">Activé</label></div><div class="fs11 muted mt6">Lorsque cette option est activée, les boutons du SpeechMike ne fonctionneront que lorsque la fenêtre du navigateur est au premier plan.</div>`;
    s3.append(cb);
    wrap.append(s1, s2, s3);
    el("#settingsContent").append(wrap);
  } else if (state.settingsTab === "dictation") {
    const wrap = create("div", "content");
    const s1 = create("div", "mb20 section-activation");
    const title = create("div", "fs13 bold mb12", "Activation");
    s1.append(title);
    const info = create(
      "div",
      "info-box fs11 mb12",
      "Dictez du texte librement dans n'importe quel champ texte du web (RIS, Gmail, formulaires)."
    );
    s1.append(info);
    const settingGroup = create("div", "setting-group mb12");
    const label = create(
      "label",
      "bold fs12 mb6",
      "Méthode d'activation par défaut"
    );
    const select = create("select", "select w100 p8");
    select.innerHTML = `
  <option>SpeechMike (bouton pressé)</option>
  <option>Bouton micro dans Spark</option>
  <option>Raccourci clavier</option>
`;
    settingGroup.append(label, select);
    s1.append(settingGroup);
    wrap.append(s1);
    el("#settingsContent").append(wrap);
    const s2 = create("div");
    s2.append(create("div", "fs13 bold mb12", "Domaines autorisés"));
    s2.innerHTML += `<div class="mb12"><label class="fs12 mb6" style="display:block">Autoriser dictée libre sur</label><textarea class="textarea" style="min-height:80px">rish.doctreen.com
gmail.com
pacs.hospital.fr</textarea><div class="fs11 muted mt6">Un domaine par ligne. Laissez vide pour autoriser tous.</div></div>`;
    wrap.append(s2);
    const s3 = create("div");
    s3.append(create("div", "fs13 bold mb12", "Comportement"));
    s3.innerHTML += `<div class="mb12"><label class="fs12 mb6" style="display:block">Afficher le dernier champ détecté</label><div style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="show-field" checked style="width:16px;height:16px;cursor:pointer;margin-top:2px"/><label class="fs12" for="show-field" style="cursor:pointer;flex:1">Activé</label></div><div class="fs11 muted mt6">Affiche: [RIS &gt; Champ-Commentaire]</div></div><div class="mb12"><label class="fs12 mb6" style="display:block">Auto-désactivation après silence</label><div style="display:flex;gap:8px;align-items:flex-start"><input type="checkbox" id="auto-deactivate" checked style="width:16px;height:16px;cursor:pointer;margin-top:2px"/><label class="fs12" for="auto-deactivate" style="cursor:pointer;flex:1">3 secondes</label></div></div>`;
    wrap.append(s3);
    el("#settingsContent").append(wrap);
  } else if (state.settingsTab === "shortcuts") {
    const wrap = create("div", "content p12");
    wrap.append(create("div", "fs13 bold mb12", "Raccourcis clavier"));

    const shortcuts = [
      {
        section: "Spark",
        items: [
          { label: "Ouvrir/Fermer Spark", key: "Shift + Alt + S" },
          { label: "Activer dictée (Compte rendu)", key: "Space" },
          { label: "Envoyer", key: "Ctrl + Enter" },
          { label: "Corriger", key: "Ctrl + Shift + E" },
          { label: "Cohérence", key: "Ctrl + Shift + V" },
          { label: "Copier document", key: "Ctrl + Shift + C" },
        ],
      },
      {
        section: "Voice",
        items: [
          { label: "Activer", key: "Ctrl + Shift + D" },
          { label: "Arrêter", key: "Escape" },
        ],
      },
      {
        section: "Onglets",
        items: [
          { label: "Compte rendu", key: "Ctrl + 1" },
          { label: "Courrier", key: "Ctrl + 2" },
          { label: "Cohérence", key: "Ctrl + 3" },
        ],
      },
    ];
    shortcuts.forEach((group) => {
      const section = create("div", "section mb16");

      const title = create("div", "section-title fs12 bold mb8", group.section);
      section.append(title);

      group.items.forEach((item) => {
        const shortcut = create("div", "shortcut flex-between mb4 fs12");
        shortcut.append(
          create("span", "", item.label),
          create("span", "shortcut-key mono fs10", item.key)
        );
        section.append(shortcut);
      });

      wrap.append(section);
    });

    el("#settingsContent").append(wrap);
  }
}
