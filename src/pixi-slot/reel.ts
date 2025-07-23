import { BlurFilter, Container, Sprite, type Texture } from "pixi.js";
import { createSymbol, getSlotTextures } from "./utils.ts";

export class Reel {
  container: Container;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter = new BlurFilter();
  reelId: number | null;

  constructor(
    reelId: number,
    container: Container = new Container(),
    position: number = 0,
    previousPosition: number = 0,
    symbols: Sprite[] = [],
    blur: BlurFilter = new BlurFilter(),
  ) {
    this.container = container;
    this.symbols = symbols;
    this.position = position;
    this.previousPosition = previousPosition;
    this.blur = blur;
    this.reelId = reelId;
  }

  addSymbol(symbol: Sprite) {
    this.symbols.push(symbol);
    this.container.addChild(symbol);
  }

  createSymbolsForReel(symbolCount: number) {
    const SLOT_TEXTURES: Texture[] = getSlotTextures();
    for (let symbolNum = 0; symbolNum < symbolCount; symbolNum++) {
      const symbol = createSymbol(SLOT_TEXTURES, symbolNum);
      this.addSymbol(symbol);
    }
  }
}
