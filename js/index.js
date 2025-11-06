// index.js (entrypoint)
import { initEvents } from "./events/init.js";
import { render } from "./views/root.js";

initEvents();

export { render };
