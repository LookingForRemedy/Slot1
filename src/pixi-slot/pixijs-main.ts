import { Application, Container, type Sprite, Texture } from "pixi.js";
import { gsap } from "gsap";
import { createReel, getSlotTextures, loadTextureAssets } from "./utils.ts";
import {
  REELS_COUNT,
  SYMBOL_COUNT,
  SYMBOL_SIZE,
  SYMBOLS_IDS,
} from "./constants.ts";
import { Reel } from "./reel.ts";
import {
  generateGradientFill,
  generateHudBottom,
  generateHudTop,
  generateTextStyle,
} from "./hud.ts";

export async function slotMachine() {
  const app = new Application();

  await app.init({ background: "#1099bb", resizeTo: window });

  document.body.appendChild(app.canvas);

  await loadTextureAssets();

  const SLOT_TEXTURES: Texture[] = getSlotTextures();

  const REEL_CONTAINER = new Container();

  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  REEL_CONTAINER.y = margin;
  REEL_CONTAINER.x = Math.round(app.screen.width / 4);

  const reels: Reel[] = [];
  for (let reelNum = 0; reelNum < REELS_COUNT; reelNum++) {
    const reel = createReel(reelNum);

    REEL_CONTAINER.addChild(reel.container);

    reels.push(reel);

    reel.createSymbolsForReel(SLOT_TEXTURES, SYMBOL_COUNT);
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

  let running = false;

  function startPlay() {
    if (running) return;
    running = true;

    for (let reelNum = 0; reelNum < reels.length; reelNum++) {
      const reel = reels[reelNum];
      reel.position = 0;
      const target = reel.position + REELS_COUNT + (reelNum + 1);
      const duration = 1 + reelNum * 0.3;

      gsap.to(reel, {
        position: target,
        duration: duration,
        ease: "",
        onComplete: () => reelsComplete(reel),
        onUpdate: () => {
          SetBlur(reel);
          MoveToTop(reel);
        },
      });
    }

    function SetBlur(reel: Reel) {
      reel.blur.strengthY = (reel.position - reel.previousPosition) * 8;
      reel.previousPosition = reel.position;
    }

    function MoveToTop(reel: Reel) {
      for (let symbolNum = 0; symbolNum < reel.symbols.length; symbolNum++) {
        const sprite = reel.symbols[symbolNum];
        const prevY = sprite.y;
        sprite.y =
          ((reel.position + symbolNum) % reel.symbols.length) * SYMBOL_SIZE -
          SYMBOL_SIZE;

        if (sprite.y < 0 && prevY > SYMBOL_SIZE) {
          sprite.texture =
            SLOT_TEXTURES[Math.floor(Math.random() * SLOT_TEXTURES.length)];
          sprite.scale.x = sprite.scale.y = Math.min(
            SYMBOL_SIZE / sprite.texture.width,
            SYMBOL_SIZE / sprite.texture.height,
          );
          sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
        }
      }
    }

    function MoveToTopLast(reel: Reel) {
      for (
        let symbolNum = reel.symbols.length - 1;
        symbolNum >= 0;
        symbolNum--
      ) {
        const symbol: Sprite = reel.symbols[symbolNum];
        const prevY = symbol.y;
        symbol.y =
          ((reel.position + symbolNum) % reel.symbols.length) * SYMBOL_SIZE -
          SYMBOL_SIZE;

        if (symbol.y < 0 && prevY > SYMBOL_SIZE && reel.reelId !== null) {
          const symbolId: number = reel.reelId * (REELS_COUNT - 1) + symbolNum;
          symbol.texture = SLOT_TEXTURES[SYMBOLS_IDS[symbolId]];
          symbol.scale.x = symbol.scale.y = Math.min(
            SYMBOL_SIZE / symbol.texture.width,
            SYMBOL_SIZE / symbol.texture.height,
          );
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        }
      }
      if (reel.reelId === reels.length - 1) {
        running = false;
      }
    }

    function reelsComplete(reel: Reel) {
      const target = reel.position + SYMBOL_COUNT;

      gsap.to(reel, {
        position: target,
        duration: 1,
        ease: "",
        onUpdate: () => {
          SetBlur(reel);
          MoveToTopLast(reel);
        },
      });
    }
  }
}
