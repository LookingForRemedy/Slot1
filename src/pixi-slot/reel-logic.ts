import { Reel } from "./reel.ts";
import {
  REELS_COUNT,
  SYMBOL_COUNT,
  SYMBOL_SIZE,
  SYMBOLS_IDS,
} from "./constants.ts";
import { gsap } from "gsap";
import { type Sprite, Texture } from "pixi.js";
import { getSlotTextures } from "./utils.ts";

export function moveReel(reel: Reel): void {
  // reel.position = 0;
  // const target = reel.position + SYMBOL_COUNT;
  // const duration = 1 + reel.reelId! * 0.3;
  //
  // gsap.to(reel, {
  //   position: target,
  //   duration: duration,
  //   ease: "sine.inOut",
  //   onComplete: () => {
  //     reelsComplete(reel);
  //   },
  //   onUpdate: () => {
  //     setBlur(reel);
  //     moveToTop(reel);
  //   },
  // });

  reel.spinReel();
}

export function stopSpin(reel: Reel): void {
  reel.stopSpin();
}

function setBlur(reel: Reel) {
  reel.blur.strengthY = (reel.position - reel.previousPosition) * 8;
  reel.previousPosition = reel.position;
}

function moveToTop(reel: Reel) {
  const SLOT_TEXTURES: Texture[] = getSlotTextures();

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

function reelsComplete(reel: Reel) {
  const target = reel.position + SYMBOL_COUNT;

  gsap.to(reel, {
    position: target,
    duration: 1,
    ease: "",
    onUpdate: () => {
      setBlur(reel);
      moveToTopLast(reel);
    },
  });
}

function moveToTopLast(reel: Reel): boolean {
  const SLOT_TEXTURES: Texture[] = getSlotTextures();

  for (let symbolNum = reel.symbols.length - 1; symbolNum >= 0; symbolNum--) {
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
  return reel.reelId !== REELS_COUNT - 1;
}
