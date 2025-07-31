import { BlurFilter, Container, Sprite, type Texture } from "pixi.js";
import { createSymbol, getSlotTextures } from "./utils.ts";
import {
  REELS_COUNT,
  SYMBOL_COUNT,
  SYMBOL_SIZE,
  SYMBOLS_IDS,
} from "./constants/constants.ts";
import { gsap } from "gsap";

export class Reel {
  container: Container;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter = new BlurFilter();
  reelId: number | null;
  reelTweenTimeline: GSAPTween;
  SLOT_TEXTURES: Texture[] = [];

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

    this.SLOT_TEXTURES = getSlotTextures();

    const target = this.position + SYMBOL_COUNT;
    const duration = 2 + this.reelId!;

    this.reelTweenTimeline = gsap.to(this, {
      position: target,
      duration: duration,
      ease: "sine.inOut",
      paused: true,
      onComplete: () => {
        this.moveToTopLast();
      },
      onUpdate: () => {
        this.moveToTop();
        this.setBlur();
      },
    });
  }

  addSymbol(symbol: Sprite) {
    this.symbols.push(symbol);
    this.container.addChild(symbol);
  }

  createSymbolsForReel(symbolCount: number) {
    for (let symbolNum = 0; symbolNum < symbolCount; symbolNum++) {
      const symbol = createSymbol(this.SLOT_TEXTURES, symbolNum);
      this.addSymbol(symbol);
    }
  }

  private setBlur(): void {
    this.blur.strengthY = (this.position - this.previousPosition) * 8;
    this.previousPosition = this.position;
  }

  private moveToTop(): void {
    for (let symbolNum = 0; symbolNum < this.symbols.length; symbolNum++) {
      const sprite = this.symbols[symbolNum];
      const prevY = sprite.y;
      sprite.y =
        ((this.position + symbolNum) % this.symbols.length) * SYMBOL_SIZE -
        SYMBOL_SIZE;

      if (sprite.y < 0 && prevY > SYMBOL_SIZE) {
        sprite.texture =
          this.SLOT_TEXTURES[
            Math.floor(Math.random() * this.SLOT_TEXTURES.length)
          ];
        sprite.scale.x = sprite.scale.y = Math.min(
          SYMBOL_SIZE / sprite.texture.width,
          SYMBOL_SIZE / sprite.texture.height,
        );
        sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
      }
    }
  }

  private moveToTopLast(): void {
    console.log("moveToTopLast");
    for (let symbolNum = this.symbols.length - 1; symbolNum >= 0; symbolNum--) {
      const symbol: Sprite = this.symbols[symbolNum];
      const prevY = symbol.y;
      symbol.y =
        ((this.position + symbolNum) % this.symbols.length) * SYMBOL_SIZE -
        SYMBOL_SIZE;

      if (symbol.y < 0 && prevY > SYMBOL_SIZE && this.reelId !== null) {
        const symbolId: number = this.reelId * (REELS_COUNT - 1) + symbolNum;
        symbol.texture = this.SLOT_TEXTURES[SYMBOLS_IDS[symbolId]];
        symbol.scale.x = symbol.scale.y = Math.min(
          SYMBOL_SIZE / symbol.texture.width,
          SYMBOL_SIZE / symbol.texture.height,
        );
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      }
    }
  }

  // private resetReelPosition(): void {
  //   this.position = 0;
  // }
  //
  // private reelStart() {
  //   var tl = gsap.timeline();
  //   //...add animations here...
  //   return tl;
  // }
  //
  // private reelMiddle() {
  //   let tl = gsap.timeline();
  //   //...add animations here...
  //   return tl;
  // }
  //
  // private reelFinish() {
  //   var tl = gsap.timeline();
  //   //...add animations here...
  //   return tl;
  // }
}
