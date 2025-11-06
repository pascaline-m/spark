// utils/dom.js
export const el = (s) => document.querySelector(s);

export function create(tag, cls = "", html = "") {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html) n.innerHTML = html;
  return n;
}

export const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[m])
  );

export function textNode(t) {
  return document.createTextNode(t);
}
