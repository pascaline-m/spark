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
    const langLabel = create("label", "settings-label fs12 bold mb6", "Langue");
    const langSelect = create("select", "select w100 p8");
    langSelect.innerHTML = `<option>Français</option><option>English</option>`;
    lang.append(langLabel, langSelect);

    const theme = create("div", "mb12");
    const themeLabel = create("label", "settings-label fs12 bold mb6", "Préférence d'affichage");
    const themeSelect = create("select", "select w100 p8");
    themeSelect.innerHTML = `<option>Automatique</option><option>Clair</option><option>Sombre</option>`;
    theme.append(themeLabel, themeSelect);

    s1.append(lang, theme);
    wrap.append(s1);

    const s2 = create("div");
    s2.append(create("div", "fs13 bold mb12", "Par défaut à l'ouverture"));

    const iaMode = create("div", "mb12");
    const iaModeLabel = create("label", "settings-label fs12 bold mb6", "Mode IA");
    const iaModeDesc = create("div", "fs11 muted mt6", "Choisissez le mode par défaut lors du démarrage.");
    const iaModeSelect = create("select", "select w100 p8");
    iaModeSelect.innerHTML = `<option>Classique</option><option>Enrichi</option><option>Marty</option>`;
    iaMode.append(iaModeLabel, iaModeDesc, iaModeSelect);

    const tab = create("div", "mb12");
    const tabLabel = create("label", "settings-label fs12 bold mb6", "Onglet");
    const tabDesc = create("div", "fs11 muted mt6", "Sélectionnez l'onglet qui s'affiche lors de l'ouverture de l'extension.");
    const tabSelect = create("select", "select w100 p8");
    tabSelect.innerHTML = `<option>Spark</option><option>Voice</option>`;
    tab.append(tabLabel, tabDesc, tabSelect);

    s2.append(iaMode, tab);
    wrap.append(s2);

    const s3 = create("div");
    s3.append(create("div", "fs13 bold mb12", "Injection dans le RIS"));

    const risAuto = create("div", "mb12");
    const risAutoRow = create("div", "settings-checkbox-row p6");
    const risAutoCheckbox = create("input");
    risAutoCheckbox.type = "checkbox";
    risAutoCheckbox.id = "ris-auto";
    risAutoCheckbox.checked = true;
    risAutoCheckbox.className = "settings-checkbox";
    const risAutoLabel = create("label", "settings-checkbox-label fs12", "Automatique");
    risAutoLabel.htmlFor = "ris-auto";
    risAutoRow.append(risAutoCheckbox, risAutoLabel);
    const risAutoDesc = create("div", "fs11 muted mt6", "Injecte automatiquement les comptes rendus dans votre RIS après génération.");
    risAuto.append(risAutoRow, risAutoDesc);

    const allDomains = create("div", "mb12");
    const allDomainsRow = create("div", "settings-checkbox-row p6");
    const allDomainsCheckbox = create("input");
    allDomainsCheckbox.type = "checkbox";
    allDomainsCheckbox.id = "all-domains";
    allDomainsCheckbox.className = "settings-checkbox";
    const allDomainsLabel = create("label", "settings-checkbox-label fs12", "Autoriser tous les domaines");
    allDomainsLabel.htmlFor = "all-domains";
    allDomainsRow.append(allDomainsCheckbox, allDomainsLabel);
    const allDomainsDesc = create("div", "fs11 muted mt6", "Permettre à Spark d'injecter du contenu dans n'importe quelle page. Nécessaire pour l'intégration RIS lorsqu'il est déployé sur un réseau local.");
    allDomains.append(allDomainsRow, allDomainsDesc);

    s3.append(risAuto, allDomains);
    wrap.append(s3);

    const s4 = create("div");
    s4.append(create("div", "fs13 bold mb12", "Extension"));
    const b1 = create("button", "btn w100 fs11 mb12", "Vérifier les mises à jour");
    const b2 = create("button", "btn w100 fs11 mb12", "Générer un rapport de débogage");
    s4.append(b1, b2);
    wrap.append(s4);
    root.append(wrap);
  } else if (state.settingsTab === "devices") {
    const wrap = create("div", "content");
    const s1 = create("div");
    s1.append(create("div", "fs13 bold mb12", "Connexion"));
    const c1 = create("button", "btn w100 fs11 mb12 bold connect-speechmike", "CONNECTER UN SPEECHMIKE");
    s1.append(c1);

    const s2 = create("div");
    s2.append(create("div", "fs13 bold mb12", "SpeechMike"));
    const info = create("div", "settings-info-box fs11 mb10");
    info.innerHTML = `<strong>État:</strong> Connecté<br/><br/><strong>Modèle:</strong> Philips SpeechMike Premium LFH3500<br/><br/><strong>Firmware:</strong> v3.2.1`;
    s2.append(info);

    const selector = create("div", "mb12");
    const selectorLabel = create("label", "settings-label mt20 fs12 bold mb6", "Bouton SpeechMike");
    const selectorSelect = create("select", "select w100 p8");
    selectorSelect.onchange = () => {
      if (typeof updateModeDescription === 'function') updateModeDescription();
    };
    selectorSelect.innerHTML = `
      <option value="spark">Spark uniquement</option>
      <option value="universal" selected>Voice (mode universel)</option>
      <option value="targeted">Voice avec RIS + Gmail autorisés</option>
    `;
    const modeDesc = create("div", "settings-note");
    modeDesc.id = "mode-desc";
    modeDesc.innerHTML = `<strong>Mode universel:</strong> Dictez dans n'importe quel formulaire du web. Utilisez pour: Emails, RIS, formulaires.`;
    selector.append(selectorLabel, selectorSelect, modeDesc);
    s2.append(selector);

    const s3 = create("div");
    s3.append(create("div", "fs13 bold mb12", "Comportement"));
    const cb = create("div", "mb12");
    const cbLabel = create("label", "settings-label fs12 bold mb6", "Exiger le focus pour SpeechMike");
    const cbRow = create("div", "settings-checkbox-row");
    const cbCheckbox = create("input");
    cbCheckbox.type = "checkbox";
    cbCheckbox.id = "focus-required";
    cbCheckbox.checked = true;
    cbCheckbox.className = "settings-checkbox";
    const cbCheckboxLabel = create("label", "settings-checkbox-label fs12", "Activé");
    cbCheckboxLabel.htmlFor = "focus-required";
    cbRow.append(cbCheckbox, cbCheckboxLabel);
    const cbDesc = create("div", "fs11 muted mt6", "Lorsque cette option est activée, les boutons du SpeechMike ne fonctionneront que lorsque la fenêtre du navigateur est au premier plan.");
    cb.append(cbLabel, cbRow, cbDesc);
    s3.append(cb);

    wrap.append(s1, s2, s3);
    el("#settingsContent").append(wrap);
  } else if (state.settingsTab === "dictation") {
    const wrap = create("div", "content");
    const s1 = create("div", "mb20 section-activation");
    const title = create("div", "fs13 bold mb12", "Activation");
    s1.append(title);
    const info = create("div", "info-box fs11 mb12", "Dictez du texte librement dans n'importe quel champ texte du web (RIS, Gmail, formulaires).");
    s1.append(info);

    const settingGroup = create("div", "setting-group mb12");
    const label = create("label", "settings-label bold fs12 mb6", "Méthode d'activation par défaut");
    const select = create("select", "select w100 p8");
    select.innerHTML = `
      <option>SpeechMike (bouton pressé)</option>
      <option>Bouton micro dans Spark</option>
      <option>Raccourci clavier</option>
    `;
    settingGroup.append(label, select);
    s1.append(settingGroup);
    wrap.append(s1);

    const s2 = create("div");
    s2.append(create("div", "fs13 bold mb12", "Domaines autorisés"));
    const domainsGroup = create("div", "mb12");
    const domainsLabel = create("label", "settings-label fs12 mb6", "Autoriser dictée libre sur");
    const domainsTextarea = create("textarea", "textarea min-h-80");
    domainsTextarea.value = `rish.doctreen.com\ngmail.com\npacs.hospital.fr`;
    const domainsDesc = create("div", "fs11 muted mt6", "Un domaine par ligne. Laissez vide pour autoriser tous.");
    domainsGroup.append(domainsLabel, domainsTextarea, domainsDesc);
    s2.append(domainsGroup);
    wrap.append(s2);

    const s3 = create("div");
    s3.append(create("div", "fs13 bold mb12", "Comportement"));

    const showField = create("div", "mb12");
    const showFieldLabel = create("label", "settings-label fs12 mb6", "Afficher le dernier champ détecté");
    const showFieldRow = create("div", "settings-checkbox-row");
    const showFieldCheckbox = create("input");
    showFieldCheckbox.type = "checkbox";
    showFieldCheckbox.id = "show-field";
    showFieldCheckbox.checked = true;
    showFieldCheckbox.className = "settings-checkbox";
    const showFieldCheckboxLabel = create("label", "settings-checkbox-label fs12", "Activé");
    showFieldCheckboxLabel.htmlFor = "show-field";
    showFieldRow.append(showFieldCheckbox, showFieldCheckboxLabel);
    const showFieldDesc = create("div", "fs11 muted mt6", "Affiche: [RIS > Champ-Commentaire]");
    showField.append(showFieldLabel, showFieldRow, showFieldDesc);

    const autoDeactivate = create("div", "mb12");
    const autoDeactivateLabel = create("label", "settings-label fs12 mb6", "Auto-désactivation après silence");
    const autoDeactivateRow = create("div", "settings-checkbox-row");
    const autoDeactivateCheckbox = create("input");
    autoDeactivateCheckbox.type = "checkbox";
    autoDeactivateCheckbox.id = "auto-deactivate";
    autoDeactivateCheckbox.checked = true;
    autoDeactivateCheckbox.className = "settings-checkbox";
    const autoDeactivateCheckboxLabel = create("label", "settings-checkbox-label fs12", "3 secondes");
    autoDeactivateCheckboxLabel.htmlFor = "auto-deactivate";
    autoDeactivateRow.append(autoDeactivateCheckbox, autoDeactivateCheckboxLabel);
    autoDeactivate.append(autoDeactivateLabel, autoDeactivateRow);

    s3.append(showField, autoDeactivate);
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
