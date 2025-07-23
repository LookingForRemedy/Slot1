import {
  Color,
  FillGradient,
  Graphics,
  type Rectangle,
  Text,
  TextStyle,
} from "pixi.js";
import { SYMBOL_SIZE } from "./constants.ts";

export function generateGradientFill(): FillGradient {
  const fill = new FillGradient({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 2 },
  });

  const colors = [0xffffff, 0x00ff99].map((color) =>
    Color.shared.setValue(color).toNumber(),
  );

  colors.forEach((number, index) => {
    const ratio = index / colors.length;

    fill.addColorStop(ratio, number);
  });
  return fill;
}

export function generateHudTop(
  screen: Rectangle,
  margin: number,
  style: TextStyle,
): Graphics {
  const top = new Graphics()
    .rect(0, 0, screen.width, margin)
    .fill({ color: 0x0 });

  const headerText = new Text({ text: "PIXI MONSTER SLOTS!", style });
  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);

  top.addChild(headerText);

  return top;
}

export function generateHudBottom(
  screen: Rectangle,
  margin: number,
  style: TextStyle,
): Graphics {
  const playText = new Text({ text: "Spin the wheels!", style });

  const bottom: Graphics = new Graphics()
    .rect(0, SYMBOL_SIZE * 3 + margin, screen.width, margin)
    .fill({ color: 0x0 });

  bottom.eventMode = "static";
  bottom.cursor = "pointer";

  playText.x = Math.round((screen.width - playText.width) / 2);
  playText.y =
    screen.height - margin + Math.round((margin - playText.height) / 2);

  bottom.addChild(playText);

  return bottom;
}

export function generateTextStyle(fill: FillGradient): TextStyle {
  return new TextStyle({
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
}
