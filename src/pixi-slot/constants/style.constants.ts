import { Color } from "pixi.js";

export const BACKGROUND_COLOR = "#9d97ac";

export const GRADIENT_COLORS = [0xfaaaff, 0x00ff99].map((color) =>
  Color.shared.setValue(color).toNumber(),
);

export const HUD_COLOR = "#030e3a";

export const BACKGROUND_REEL_COLOR = "#650a5a";
export const REEL_BORDER_COLOR = "#030e3a";
export const REEL_BORDER_WIDTH = 2;
