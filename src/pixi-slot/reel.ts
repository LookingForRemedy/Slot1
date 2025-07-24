import { BlurFilter, Container, Sprite, type Texture } from "pixi.js";
import { createSymbol, getSlotTextures } from "./utils.ts";
import {gsap} from "gsap";
import {SYMBOL_SIZE} from "./constants.ts";
import Tween = gsap.core.Tween;

export class Reel {
  container: Container;
  symbols: Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter = new BlurFilter();
  reelId: number | null;
  reelTween: Tween | null = null;
  isSpinning: boolean = false;
  stopRequested: boolean = false;

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

  spinReel(speed = 5) {
    this.isSpinning = true;
    this.stopRequested = false;
    console.log("test")

    const spinLoop = () => {
      if (!this.isSpinning) return;
      this.reelTween = gsap.to(this.container, {
        y: `+=${SYMBOL_SIZE}`,
        duration: speed / 10,
        ease: "none",
        onComplete: () => {
          console.log("te22st")
          this.container.y %= SYMBOL_SIZE * (this.symbols.length - 1);
          this.UpdateSymbols();
          spinLoop();
        }
      });
    };

    spinLoop();
  }

  stopSpin() {
    if (!this.isSpinning) return;

    this.isSpinning = false;
    if (this.reelTween) this.reelTween.kill();

    // Доезжаем к нужным символам
    gsap.to(this.container, {
      y: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => {
        const SLOT_TEXTURES: Texture[] = getSlotTextures();
        for (let i = 0; i < SLOT_TEXTURES.length; i++) {
          let symbol = this.symbols[i];
          symbol.texture = SLOT_TEXTURES[0];
          symbol.y = i * SYMBOL_SIZE;
          symbol.scale.x = symbol.scale.y = Math.min(
              SYMBOL_SIZE / symbol.texture.width,
              SYMBOL_SIZE / symbol.texture.height,
          );
          symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        }

        for (let i = SLOT_TEXTURES.length; i < this.symbols.length; i++) {
          this.symbols[i].texture = SLOT_TEXTURES[i];
          this.symbols[i].y = i * SYMBOL_SIZE;
        }

        this.container.y = 0;
      }
    });
  }

  UpdateSymbols()
  {
    for (let i = 0; i < this.symbols.length; i++) {
      const symbol = this.symbols[i];
      const globalY = this.container.y + SYMBOL_SIZE + symbol.y;
      if (this.reelId == 0){
        console.log(globalY + " =========== " + symbol.y);

      }


      if (globalY >= SYMBOL_SIZE * this.symbols.length) {
        symbol.y -= SYMBOL_SIZE * this.symbols.length;
      }
    }

    if (this.stopRequested) {
      this.stopSpin();
    }
  }
}
