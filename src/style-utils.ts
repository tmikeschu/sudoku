import { Square } from "./board";
import { Coordinate } from "./types";

export const coordinateToGridArea = (coordinate: Coordinate): string => {
  return `c${coordinate.replace(",", "")}`;
};

export const getSquareTemplateAreas = (square: Square) =>
  square.map((row) => `"${row.map(coordinateToGridArea).join(" ")}"`).join(" ");

export const BOARD_TEMPLATE_AREAS = `"s0 s1 s2" "s3 s4 s5" "s6 s7 s8"`;
