import { ROWS } from "./board";
import { Coordinate } from "./types";

export const coordinateToGridArea = (coordinate: Coordinate): string => {
  return `c${coordinate.replace(",", "")}`;
};

export const BOARD_TEMPLATE_AREAS = [...ROWS.entries()]
  .sort(([a], [b]) => a - b)
  .map(([, x]) => `"${x.map(coordinateToGridArea).join(" ")}"`)
  .join(" ");
