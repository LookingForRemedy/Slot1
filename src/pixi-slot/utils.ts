import { Assets, type Container, Graphics, Sprite, Texture } from "pixi.js";
import { Reel } from "./reel.ts";
import {
  REEL_WIDTH,
  REELS_COUNT,
  SYMBOL_COUNT,
  SYMBOL_SIZE,
} from "./constants/constants.ts";
import {
  BACKGROUND_REEL_COLOR,
  REEL_BORDER_COLOR,
  REEL_BORDER_WIDTH,
} from "./constants/style.constants.ts";

export async function loadTextureAssets(): Promise<void> {
  await Assets.load([
    "images/A.png",
    "images/J.png",
    "images/K.png",
    "images/Q.png",
    "images/Pic_A_00.png",
    "images/Pic_B_00.png",
    "images/Pic_C_00.png",
    "images/Pic_D_00.png",
    "images/Pic_E_00.png",
    "images/Prize_00.png",
    "images/Wild_00.png",
  ]);
}

export function getSlotTextures(): Texture[] {
  return [
    Texture.from("images/A.png"),
    Texture.from("images/J.png"),
    Texture.from("images/K.png"),
    Texture.from("images/Q.png"),
    Texture.from("images/Pic_A_00.png"),
    Texture.from("images/Pic_B_00.png"),
    Texture.from("images/Pic_C_00.png"),
    Texture.from("images/Pic_D_00.png"),
    Texture.from("images/Pic_E_00.png"),
    Texture.from("images/Prize_00.png"),
    Texture.from("images/Wild_00.png"),
  ];
}

export function createReel(reelNum: number): Reel {
  const reel = new Reel(reelNum);

  reel.container.x = reelNum * REEL_WIDTH;
  reel.container.filters = [reel.blur];

  reel.blur.strengthX = 0;
  reel.blur.strengthY = 0;

  addReelBackground(reel);

  return reel;
}

export function generateReelsArray(mainContainer: Container): Reel[] {
  const reels: Reel[] = [];
  for (let reelNum = 0; reelNum < REELS_COUNT; reelNum++) {
    const reel = createReel(reelNum);

    mainContainer.addChild(reel.container);

    reels.push(reel);

    reel.createSymbolsForReel(SYMBOL_COUNT);
  }
  return reels;
}

function addReelBackground(reel: Reel): void {
  const borders = new Graphics()
    .rect(0, 0, REEL_WIDTH, SYMBOL_SIZE * SYMBOL_COUNT)
    .fill(BACKGROUND_REEL_COLOR)
    .stroke({ width: REEL_BORDER_WIDTH, color: REEL_BORDER_COLOR });
  reel.container.addChild(borders);
}

export function createSymbol(textures: Texture[], symbolNum: number): Sprite {
  const symbol = new Sprite(
    textures[Math.floor(Math.random() * textures.length)],
  );

  symbol.y = symbolNum * SYMBOL_SIZE;
  symbol.scale.x = symbol.scale.y = Math.min(
    SYMBOL_SIZE / symbol.width,
    SYMBOL_SIZE / symbol.height,
  );
  symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
  return symbol;
}
