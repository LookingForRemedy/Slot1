import { Application, Container, Texture } from "pixi.js";
import { gsap } from "gsap";
import { createReel, getSlotTextures, loadTextureAssets } from "./utils.ts";
import {
  NUMBER_OF_REELS,
  NUMBER_OF_SYMBOLS,
  REEL_WIDTH,
  SYMBOL_SIZE,
  SYMBOLS_IDS,
} from "./constants.ts";
import { Reel } from "./reel.ts";
import {
  generateBottom,
  generateGradientFill,
  generateTextStyle,
  generateTop,
} from "./hud.ts";

export async function slotMachine() {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.body.appendChild(app.canvas);

  // const textureMap: Record<string, Texture> = {};

  // const texturePaths = [
  //   "A",
  //   "J",
  //   "K",
  //   "Q",
  //   "Pic_A_00",
  //   "Pic_B_00",
  //   "Pic_C_00",
  //   "Pic_D_00",
  //   "Pic_E_00",
  //   "Prize_00",
  //   "Wild_00",
  // ];
  //
  // await Assets.load(texturePaths.map((name) => `assets/Images/${name}.png`));
  //
  // for (const name of texturePaths) {
  //   textureMap[name] = Texture.from(`assets/Images/${name}.png`);
  // }
  //
  // const sprite = new Sprite(textureMap["A"]); // начальная текстура
  // //Позже при смене текстуры:
  // symbolSprites[i].texture = textureMap["Wild_00"];

  await loadTextureAssets();

  const SLOT_TEXTURES: Texture[] = getSlotTextures();

  const REEL_CONTAINER = new Container();

  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  REEL_CONTAINER.y = margin;
  REEL_CONTAINER.x = Math.round(app.screen.width - REEL_WIDTH * 5);

  const reels: Reel[] = [];
  for (let reelNum = 0; reelNum < NUMBER_OF_REELS; reelNum++) {
    const reel = createReel(reelNum);

    REEL_CONTAINER.addChild(reel.container);

    reels.push(reel);

    reel.createSymbolsForReel(SLOT_TEXTURES, NUMBER_OF_SYMBOLS);
  }

  app.stage.addChild(REEL_CONTAINER);

  // Build top & bottom covers and position REEL_CONTAINER

  const gradientFill = generateGradientFill();

  const textStyle = generateTextStyle(gradientFill);

  const top = generateTop(app.screen, margin, textStyle);
  const bottom = generateBottom(app.screen, margin, textStyle);

  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // Set the interactivity.
  bottom.eventMode = "static";
  bottom.cursor = "pointer";
  bottom.addListener("pointerdown", () => {
    startPlay();
  });

  let running = false;

  // Function to start playing.
  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const target = r.position + 5 + (i + 1);
      const duration = 1 + i * 0.3;

      gsap.to(r, {
        position: target,
        duration: duration,
        ease: "",
        onComplete: () => reelsComplete(i),
        onUpdate: () => {
          SetBlur(r);
          MoveToTop(r);
        },
      });
    }

    // Reels done handler.
    function SetBlur(r: any) {
      r.blur.strengthY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;
    }

    function MoveToTop(r: any) {
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;

        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture =
            SLOT_TEXTURES[Math.floor(Math.random() * SLOT_TEXTURES.length)];
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height,
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }

    function MoveToTopLast(r: any) {
      for (let j = r.symbols.length - 1; j >= 0; j--) {
        const s = r.symbols[j];
        const prevy = s.y;
        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;

        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          s.texture = SLOT_TEXTURES[SYMBOLS_IDS[r.reelId * 4 + j]];
          console.log(
            `image id = ${r.reelId * 4 + j} reel id = ${r.reelId} symbol id = ${j} SLOT_TEXTURES = ${SYMBOLS_IDS[r.reelId * 4 + j]}`,
          );
          s.scale.x = s.scale.y = Math.min(
            SYMBOL_SIZE / s.texture.width,
            SYMBOL_SIZE / s.texture.height,
          );
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }

    // Reels done handler.
    function reelsComplete(index: any) {
      console.log(index);
      const r = reels[index];
      const target = r.position + 4;

      gsap.to(r, {
        position: target,
        duration: 1,
        ease: "",
        // onComplete: () => reelsComplete(i),
        onUpdate: () => {
          SetBlur(r);
          MoveToTopLast(r);
        },
      });

      if (index === reels.length - 1) {
        running = false;
      }
    }
  }
}
