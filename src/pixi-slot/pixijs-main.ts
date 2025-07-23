import { Application, Container } from "pixi.js";
import { createReel, loadTextureAssets } from "./utils.ts";
import { REELS_COUNT, SYMBOL_COUNT, SYMBOL_SIZE } from "./constants.ts";
import { Reel } from "./reel.ts";
import {
  generateGradientFill,
  generateHudBottom,
  generateHudTop,
  generateTextStyle,
} from "./hud.ts";
import { moveReel } from "./reel-logic.ts";

export async function slotMachine() {
  const app = new Application();

  await app.init({ background: "#1099bb", resizeTo: window });

  document.body.appendChild(app.canvas);

  await loadTextureAssets();

  const REEL_CONTAINER = new Container();

  let isRunning = false;

  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  REEL_CONTAINER.y = margin;
  REEL_CONTAINER.x = Math.round(app.screen.width / 4);

  const reels: Reel[] = [];
  for (let reelNum = 0; reelNum < REELS_COUNT; reelNum++) {
    const reel = createReel(reelNum);

    REEL_CONTAINER.addChild(reel.container);

    reels.push(reel);

    reel.createSymbolsForReel(SYMBOL_COUNT);
  }

  app.stage.addChild(REEL_CONTAINER);

  const gradientFill = generateGradientFill();

  const textStyle = generateTextStyle(gradientFill);

  const hudTop = generateHudTop(app.screen, margin, textStyle);
  const hudBottom = generateHudBottom(app.screen, margin, textStyle);

  app.stage.addChild(hudTop);
  app.stage.addChild(hudBottom);

  hudBottom.addListener("pointerdown", () => {
    startPlay();
  });

  function startPlay() {
    if (isRunning) return;
    isRunning = true;

    for (const reel of reels) {
      moveReel(reel);
    }
  }
}
