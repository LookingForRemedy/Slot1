import { Assets, Sprite, Texture } from "pixi.js";
import { Reel } from "./reel.ts";
import { REEL_WIDTH, SYMBOL_SIZE } from "./constants.ts";

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

  return reel;
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
