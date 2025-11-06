// config/constants.js

/**
 * Application-wide constants
 */

// Timing constants (in milliseconds)
export const TIMING = {
  SUCCESS_MESSAGE_DURATION: 2500,
  PROCESSING_DELAY: 800,
  DICTATION_COMPLETE_DELAY: 1000,
  DICTATION_INTERVAL: 200,
};

// UI Text constants
export const UI_TEXT = {
  APP_TITLE: "Doctreen Spark",
  SETTINGS_TITLE: "Mes réglages",

  // Tab labels
  TABS: {
    REPORT: "Compte rendu",
    VOICE: "Voice",
    PREFERENCES: "Préférences",
    DEVICES: "Micro",
    DICTATION: "Voice",
    SHORTCUTS: "Raccourcis",
  },

  // Dropdown labels
  DROPDOWNS: {
    REPORT_MODE: "Compte-rendu",
    LETTER_MODE: "Courrier",
    IA_CLASSIC: "IA classique",
    IA_ENRICHED: "IA enrichie",
    IA_MARTY: "IA Marty",
    RECIPIENT_COLLEAGUE: "Confrère",
    RECIPIENT_PATIENT: "Patient",
  },

  // Status messages
  STATUS: {
    READY: "Prêt à dicter",
    ACTIVE: "🎤 Dictée active - En écoute...",
    PROCESSING: "⟳ Traitement en cours...",
    SUCCESS: "✓ Texte inséré avec succès",
  },

  // Placeholders
  PLACEHOLDERS: {
    DICTATION: "Dictez vos observations...",
    CORRECTION: "Décrivez votre correction...",
    LETTER: "Ajoutez des instructions pour personnaliser le courrier...",
    RIS_TEXTAREA: "RIS - Résultats",
  },

  // Tooltips
  TOOLTIPS: {
    DICTATE: "Dicter",
    SEND: "Envoyer",
    COPY: "Copier",
    EDIT: "Corriger le compte rendu",
    COHERENCE: "Cohérence",
    COHERENCE_ACTIVE: "Cohérence activée",
    LETTER: "Rédiger un courrier",
    THUMBS_UP: "Satisfaisant",
    THUMBS_DOWN: "Insatisfaisant",
    DELETE: "Effacer",
    DELETE_BLOCK: "Supprimer ce bloc",
    INJECTED: "Injecté dans le RIS",
    SETTINGS: "Paramètres",
    CLOSE: "Fermer",
  },

  // Messages
  MESSAGES: {
    COPY_SUCCESS: "✓ Copié !",
    COPY_ERROR: "Impossible de copier",
    FEEDBACK_POSITIVE: "Merci pour votre retour!",
    FEEDBACK_NEGATIVE: "Retour pris en compte!",
    LETTER_SUCCESS: "Courrier généré avec succès !",
  },
};

// Document types
export const DOC_TYPES = {
  GENERIC: "generique",
  SPECIALIZED: "specialise",
  MARTY: "marty",
};

// Letter recipient types
export const RECIPIENT_TYPES = {
  COLLEAGUE: "confrere",
  PATIENT: "patient",
};

// Voice dictation states
export const VOICE_STATES = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  PROCESSING: "processing",
  SUCCESS: "success",
  ERROR: "error",
};

// CSS class names
export const CSS_CLASSES = {
  HIDDEN: "hidden",
  ACTIVE: "active",
  COLLAPSED: "collapsed",
  ACTIVE_COHERENCE: "active-coherence",
  ACTIVE_LETTER: "active-letter",
};

// Example dictation text
export const EXAMPLE_DICTATION_TEXT =
  "On note une opacité nodulaire de 3 cm au lobe supérieur droit sans foyer condensant";

// Default example CR title
export const EXAMPLE_CR_TITLE = "RUPTURE LIGAMENT CROISÉ ANTÉRIEUR GENOU GAUCHE";
