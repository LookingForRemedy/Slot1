import {
  FillGradient,
  Graphics,
  type Rectangle,
  Text,
  TextStyle,
} from "pixi.js";
import { SYMBOL_SIZE } from "./constants/constants.ts";
import { GRADIENT_COLORS, HUD_COLOR } from "./constants/style.constants.ts";

export function generateGradientFill(): FillGradient {
  const fill = new FillGradient({
    start: { x: 0, y: 0 },
    end: { x: 0, y: 2 },
  });

  GRADIENT_COLORS.forEach((number, index) => {
    const ratio = index / GRADIENT_COLORS.length;

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
    .fill({ color: HUD_COLOR });

  const headerText = new Text({
    text: "PIXI MONSTER SLOTS!",
    style,
    x: Math.round(top.width / 2),
    y: Math.round(top.height / 2),
  });

  top.addChild(headerText);

  return top;
}

export function generateHudBottom(
  screen: Rectangle,
  margin: number,
  style: TextStyle,
  play: () => void,
  stop: () => void,
): Graphics {
  const playText = new Text({
    text: "Spin",
    style,
    cursor: "pointer",
    eventMode: "static",
    x: Math.round(screen.width / 4),
    y: screen.height - margin + Math.round(margin / 4),
  });

  const stopText = new Text({
    text: "Stop",
    style,
    cursor: "pointer",
    eventMode: "static",
    x: Math.round(screen.width / 2),
    y: screen.height - margin + Math.round(margin / 4),
  });

  const bottom: Graphics = new Graphics({
    eventMode: "static",
    cursor: "pointer",
  })
    .rect(0, SYMBOL_SIZE * 3 + margin, screen.width, margin)
    .fill({ color: HUD_COLOR });

  playText.addEventListener("pointerdown", () => {
    play();
  });

  stopText.addEventListener("pointerdown", () => {
    stop();
  });

  bottom.addChild(playText);
  bottom.addChild(stopText);

  return bottom;
}

export function generateTextStyle(): TextStyle {
  const fill = generateGradientFill();
  return new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fontStyle: "italic",
    fontWeight: "bold",
    fill: { fill },
    stroke: { color: 0x4a1850, width: 5 },
    wordWrap: true,
    wordWrapWidth: 440,
  });
}
