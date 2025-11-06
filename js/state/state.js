// state/state.js
import { nowTime } from "../utils/time.js";

export const state = {
  activeTab: "cr",
  verifyMode: false,
  correctionMode: false,
  voiceDictStatus: "idle",
  showSettings: false,
  settingsTab: "preferences",
  crDocType: "generique",
  letterRecipient: "confrere",
  dictatedText: "",
  correctionInput: "",
  letterInput: "",
  crHistory: [
    {
      id: 0,
      version: 1,
      // --- Dictée initiale ---
      question: `L'examen IRM montre une rupture complète du ligament croisé antérieur gauche, 
avec une discontinuité des fibres ligamentaires et un œdème significatif. 
Un volumineux hématome intra-articulaire est observé, particulièrement marqué 
dans le récessus supra-patellaire, associé à un œdème osseux au niveau du condyle fémoral latéral. 
Tout le reste est normal.`,

      // --- Compte rendu final ---
      content: `RUPTURE LIGAMENT CROISÉ ANTÉRIEUR GENOU GAUCHE

INDICATION
Suspicion de rupture ligamentaire du genou gauche.

TECHNIQUE
Examen réalisé en coupes axiales, sagittales et coronales, pondérées en T1, T2 et DP.

RÉSULTATS
On note une discontinuité complète du ligament croisé antérieur, avec fibres ligamentaires rompues et œdème significatif.

CONCLUSION
Rupture complète du LCA avec instabilité.`,

      // --- Mots à surligner quand Cohérence est activée ---
      dictated: [
        "discontinuité complète du ligament croisé antérieur",
        "fibres ligamentaires rompues",
        "œdème significatif",
        "Rupture complète du LCA",
      ],
      time: nowTime(),
      type: "response",
      isExample: true,
    },
  ],
  letterHistory: [],
  selectedCrForLetter: null,
};
