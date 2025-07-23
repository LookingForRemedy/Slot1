import {
  Application,
  Assets,
  BlurFilter,
  Color,
  Container,
  FillGradient,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from "pixi.js";
  import { gsap } from "gsap";

  const SYMBOLS_IDS: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,10,9,8,7,6,5,4,3,2,1];

  export async function slotMachine() {
    // Create a new application
    const app = new Application();

    // Initialize the application
    await app.init({ background: "#1099bb", resizeTo: window });

    // Append the application canvas to the document body
    document.body.appendChild(app.canvas);

    // const textureMap: Record<string, Texture> = {};
    //
    // const texturePaths = [
    //   "A", "J", "K", "Q", "Pic_A_00", "Pic_B_00", "Pic_C_00",
    //   "Pic_D_00", "Pic_E_00", "Prize_00", "Wild_00"
    // ];
    //
    // await Assets.load(texturePaths.map(name => `assets/Images/${name}.png`));
    //
    // for (const name of texturePaths) {
    //   textureMap[name] = Texture.from(`assets/Images/${name}.png`);
    // }

    // const sprite = new Sprite(textureMap["A"]); // начальная текстура
    // Позже при смене текстуры:
    // symbolSprites[i].texture = textureMap["Wild_00"];

    // Load the textures
    await Assets.load([
      "Images/A.png",
      "Images/J.png",
      "Images/K.png",
      "Images/Q.png",
      "Images/Pic_A_00.png",
      "Images/Pic_B_00.png",
      "Images/Pic_C_00.png",
      "Images/Pic_D_00.png",
      "Images/Pic_E_00.png",
      "Images/Prize_00.png",
      "Images/Wild_00.png",
    ]);

    const REEL_WIDTH = 160;
    const SYMBOL_SIZE = 150;

    // // Create different slot symbols
    const slotTextures = [
      Texture.from("Images/A.png"),
      Texture.from("Images/J.png"),
      Texture.from("Images/K.png"),
      Texture.from("Images/Q.png"),
      Texture.from("Images/Pic_A_00.png"),
      Texture.from("Images/Pic_B_00.png"),
      Texture.from("Images/Pic_C_00.png"),
      Texture.from("Images/Pic_D_00.png"),
      Texture.from("Images/Pic_E_00.png"),
      Texture.from("Images/Prize_00.png"),
      Texture.from("Images/Wild_00.png"),
    ];

    // Build the reels
    const reels: any[] = [];
    const reelContainer = new Container();

    for (let i = 0; i < 5; i++) {
      const rc = new Container();

      rc.x = i * REEL_WIDTH;
      reelContainer.addChild(rc);

      const reel = {
        container: rc,
        symbols: [],
        position: 0,
        previousPosition: 0,
        blur: new BlurFilter(),
        reelId: i,
      };

      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      rc.filters = [reel.blur];

      // Build the symbols
      for (let j = 0; j < 4; j++) {
        const symbol = new Sprite(
            slotTextures[Math.floor(Math.random() * slotTextures.length)],
        );
        // Scale the symbol to fit symbol area.

        symbol.y = j * SYMBOL_SIZE;
        symbol.scale.x = symbol.scale.y = Math.min(
            SYMBOL_SIZE / symbol.width,
            SYMBOL_SIZE / symbol.height,
        );
        symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
        (reel.symbols as Sprite[]).push(symbol);
        rc.addChild(symbol);
      }
      reels.push(reel);
    }
    app.stage.addChild(reelContainer);

    // Build top & bottom covers and position reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5);
    const top = new Graphics()
        .rect(0, 0, app.screen.width, margin)
        .fill({ color: 0x0 });
    const bottom = new Graphics()
        .rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin)
        .fill({ color: 0x0 });

    // Create gradient fill
    const fill = new FillGradient(0, 0, 0, 2);

    const colors = [0xffffff, 0x00ff99].map((color) =>
        Color.shared.setValue(color).toNumber(),
    );

    colors.forEach((number, index) => {
      const ratio = index / colors.length;

      fill.addColorStop(ratio, number);
    });

    // Add play text
    const style = new TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fontStyle: "italic",
      fontWeight: "bold",
      fill: { fill },
      stroke: { color: 0x4a1850, width: 5 },
      dropShadow: {
        color: 0x000000,
        angle: Math.PI / 6,
        blur: 4,
        distance: 6,
      },
      wordWrap: true,
      wordWrapWidth: 440,
    });

    const playText = new Text("Spin the wheels!", style);

    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y =
        app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    // Add header text
    const headerText = new Text("PIXI MONSTER SLOTS!", style);

    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

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
      const duration = 1 + (i * 0.3);

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
              slotTextures[Math.floor(Math.random() * slotTextures.length)];
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
            s.texture = slotTextures[SYMBOLS_IDS[r.reelId * 4 + j]];
            console.log(`image id = ${r.reelId * 4 + j} reel id = ${r.reelId} symbol id = ${j} slotTextures = ${SYMBOLS_IDS[r.reelId * 4 + j]}`)
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