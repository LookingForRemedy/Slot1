// Initialize the slot machine when DOM is loaded

import { slotMachine } from "./pixijs-exm.ts";

document.addEventListener("DOMContentLoaded", async () => {
  await slotMachine();
});
