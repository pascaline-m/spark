// index.js (entrypoint)
import { initEvents } from "./events/init.js";
import { render } from "./views/root.js";

initEvents();

// Expose render globally for button handlers
window.render = render;

export { render };
