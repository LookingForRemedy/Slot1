import { Application, Container } from "pixi.js";
import { generateReelsArray, loadTextureAssets } from "./utils.ts";
import {
  SYMBOL_COUNT,
  SYMBOL_SIZE,
  VISIBLE_SYMBOL_COUNT,
} from "./constants/constants.ts";
import { Reel } from "./reel.ts";
import { generateHudBottom, generateHudTop, generateTextStyle } from "./hud.ts";
import { BACKGROUND_COLOR } from "./constants/style.constants.ts";
import { gsap } from "gsap";

export async function slotMachine() {
  const app = new Application();

  await app.init({ background: BACKGROUND_COLOR, resizeTo: window });

  document.body.appendChild(app.canvas);

  await loadTextureAssets();

  const HUD_MARGIN =
    (app.screen.height - SYMBOL_SIZE * VISIBLE_SYMBOL_COUNT) / 2;

  const REEL_CONTAINER = new Container({
    y: HUD_MARGIN,
    x: Math.round(app.screen.width / SYMBOL_COUNT),
  });

  const reels: Reel[] = generateReelsArray(REEL_CONTAINER);

  const masterTimeline = gsap.timeline();

  for (const reel of reels) {
    masterTimeline.add(reel.reelTweenTimeline);
  }

  app.stage.addChild(REEL_CONTAINER);

  const textStyle = generateTextStyle();

  const hudTop = generateHudTop(app.screen, HUD_MARGIN, textStyle);
  const hudBottom = generateHudBottom(
    app.screen,
    HUD_MARGIN,
    textStyle,
    () => startPlay(),
    () => stopPlay(),
  );

  app.stage.addChild(hudTop);
  app.stage.addChild(hudBottom);

  function startPlay() {
    masterTimeline.resume();
  }

  function stopPlay(): void {
    masterTimeline.pause();
  }
}
