// utils/time.js
export const nowTime = () =>
  new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
