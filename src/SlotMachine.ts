import * as PIXI from "pixi.js";
import { Assets, BlurFilter } from "pixi.js";
import { gsap } from "gsap";
import { GlowFilter } from "pixi-filters";

interface Reel {
  container: PIXI.Container;
  symbols: PIXI.Sprite[];
  position: number;
  previousPosition: number;
  blur: BlurFilter;
  tween?: gsap.core.Tween;
}

export class SlotMachine {
  private app: PIXI.Application;
  private reels: Reel[] = [];
  private running = false;
  private readonly REEL_WIDTH = 160;
  private readonly SYMBOL_SIZE = 150;
  private readonly REEL_COUNT = 5;
  private readonly VISIBLE_SYMBOLS = 3;

  constructor() {
    this.app = new PIXI.Application();
    void this.initApp();
    void this.loadAssets();
  }

  private async initApp(): Promise<void> {
    await this.app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x1099bb,
      resolution: window.devicePixelRatio || 1,
    });

    document.body.appendChild(this.app.canvas);
  }

  private async loadAssets(): Promise<void> {
    await Assets.load("src/assets/symbols.json").then(() => this.setup());
  }

  private setup(): void {
    const reelContainer = new PIXI.Container();

    // Create reels
    for (let i = 0; i < this.REEL_COUNT; i++) {
      const rc = new PIXI.Container();
      rc.x = i * this.REEL_WIDTH;
      reelContainer.addChild(rc);

      const reel: Reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Create symbols
      for (let j = 0; j < this.VISIBLE_SYMBOLS + 1; j++) {
        const randomSymbol = `symbol_${Math.floor(Math.random() * 9)}.png`;
        const texture = PIXI.Assets.get(randomSymbol);
        const symbol = new PIXI.Sprite(texture);

        this.adjustSymbolSize(symbol);
        symbol.y = j * this.SYMBOL_SIZE;
        symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);

        reel.symbols.push(symbol);
        rc.addChild(symbol);
      }

      this.reels.push(reel);
    }

    this.app.stage.addChild(reelContainer);
    this.createUI();
    this.setupGameLoop();
  }

  private adjustSymbolSize(symbol: PIXI.Sprite): void {
    const scale = Math.min(
      this.SYMBOL_SIZE / symbol.width,
      this.SYMBOL_SIZE / symbol.height,
    );
    symbol.scale.set(scale);
  }

  private setupGameLoop(): void {
    this.app.ticker.add(() => {
      this.updateReels();
    });
  }

  private updateReels(): void {
    for (const reel of this.reels) {
      reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
      reel.previousPosition = reel.position;

      for (let j = 0; j < reel.symbols.length; j++) {
        const symbol = reel.symbols[j];
        symbol.y =
          ((reel.position + j) % reel.symbols.length) * this.SYMBOL_SIZE -
          this.SYMBOL_SIZE;

        if (symbol.y < -this.SYMBOL_SIZE) {
          symbol.y += reel.symbols.length * this.SYMBOL_SIZE;
          this.updateSymbolTexture(symbol);
          this.adjustSymbolSize(symbol);
          symbol.x = Math.round((this.SYMBOL_SIZE - symbol.width) / 2);
        }
      }
    }
  }

  private updateSymbolTexture(symbol: PIXI.Sprite): void {
    const randomSymbol = `symbol_${Math.floor(Math.random() * 9)}.png`;
    symbol.texture = PIXI.Assets.get(randomSymbol);
  }

  public spin(): void {
    if (this.running) return;
    this.running = true;

    for (let i = 0; i < this.reels.length; i++) {
      const reel = this.reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = reel.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;

      reel.tween = gsap.to(reel, {
        position: target,
        duration: time / 1000,
        ease: "back.out(0.5)",
        onUpdate: () => {
          reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
          reel.previousPosition = reel.position;
        },
        onComplete: () => {
          if (i === this.reels.length - 1) {
            this.running = false;
            this.checkWin();
          }
        },
      });
    }
  }

  private checkWin(): void {
    const lines = this.getVisibleLines();
    let winAmount = 0;

    lines.forEach((line) => {
      const counts: Record<string, number> = {};
      line.forEach((symbol) => {
        const textureId = symbol.texture.uid;
        counts[textureId] = (counts[textureId] || 0) + 1;
      });

      for (const symbolId in counts) {
        if (counts[symbolId] >= 3) {
          winAmount += counts[symbolId] * 10;
          this.highlightWin(line);
        }
      }
    });

    if (winAmount > 0) {
      this.showWinMessage(winAmount);
    }
  }

  private getVisibleLines(): PIXI.Sprite[][] {
    const lines: PIXI.Sprite[][] = [];

    for (let i = 0; i < this.VISIBLE_SYMBOLS; i++) {
      const line: PIXI.Sprite[] = [];

      for (const reel of this.reels) {
        const index = Math.floor((reel.position + i) % reel.symbols.length);
        line.push(reel.symbols[index]);
      }

      lines.push(line);
    }

    return lines;
  }

  private highlightWin(line: PIXI.Sprite[]): void {
    line.forEach((symbol) => {
      const glow = new GlowFilter({
        outerStrength: 2,
        innerStrength: 1,
        color: 0xffff00,
      });
      symbol.filters = [glow];

      gsap.to(glow, {
        outerStrength: 4,
        duration: 0.5,
        yoyo: true,
        repeat: 3,
        onComplete: () => {
          symbol.filters = [];
        },
      });
    });
  }

  private createUI(): void {
    const spinButton = new PIXI.Graphics()
      .beginFill(0x00ff00)
      .drawRoundedRect(0, 0, 150, 60, 15)
      .endFill();

    spinButton.x = (this.app.screen.width - spinButton.width) / 2;
    spinButton.y = this.app.screen.height - spinButton.height - 10;
    spinButton.interactive = true;
    spinButton.eventMode = "static";

    const buttonText = new PIXI.Text("SPIN", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
      fontWeight: "bold",
    });

    buttonText.anchor.set(0.5);
    buttonText.position.set(spinButton.width / 2, spinButton.height / 2);
    spinButton.addChild(buttonText);

    spinButton.on("pointerdown", () => this.spin());
    this.app.stage.addChild(spinButton);
  }

  private showWinMessage(amount: number): void {
    const winText = new PIXI.Text(`WIN: ${amount}`, {
      fontFamily: "Arial",
      fontSize: 48,
      fill: 0xffff00,
      fontWeight: "bold",
      stroke: 0x000000,
    });

    winText.anchor.set(0.5);
    winText.position.set(this.app.screen.width / 2, 50);
    this.app.stage.addChild(winText);

    gsap.to(winText, {
      alpha: 0,
      duration: 3,
      onComplete: () => {
        this.app.stage.removeChild(winText);
      },
    });
  }
}
