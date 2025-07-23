// Initialize the slot machine when DOM is loaded

import { slotMachine } from "./pixi-slot/pixijs-main.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await slotMachine();
});
